import { acceptHMRUpdate, defineStore } from "pinia"
import { ref } from "vue"
import { ethers } from "ethers"
import { Session } from "@0xsequence/auth"
import { chainConfigs, Indexers, supportedChains } from "../utils/multichain"
import { sequenceContext, NetworkConfig } from "@0xsequence/network"
import { config } from "../utils/settings"
import { Indexer } from "@0xsequence/indexer"
import { sequence } from "0xsequence"
import { useRouter } from "vue-router"
import { normalizeAddress } from "../utils/utils"
import { Receiver, TokensMerged } from "../utils/interfaces"
import Swal from "sweetalert2"

const corsProxy = config.corsAnywhereUrl
export const services = {
    api: `https://api.sequence.app`,
    metadata: `${corsProxy}https://metadata.sequence.app`,
} as const

enum SignerLevel {
    Gold = 3,
    Silver = 2,
    Bronze = 1,
}

export const useSequenceStore = defineStore("sequence", () => {
    const sequenceApiClient = ref(
        {} as {
            indexer: Indexer
            metadataClient: sequence.metadata.SequenceMetadataClient
        }
    )
    const tokensMerged = ref([] as TokensMerged[])
    const isLoggedIn = ref(false)
    const sequenceWallet = ref(new sequence.Wallet("polygon"))
    const status = ref({ waitingFor: "signer" })
    const onPageLaunch = () => {
        isLoggedIn.value = sequenceWallet.value.isConnected()
    }
    const connectWallet = async (): Promise<void> => {
        await sequenceWallet.value.connect()
        isLoggedIn.value = true
    }
    const disconnectWallet = (): void => {
        sequenceWallet.value.disconnect()
        isLoggedIn.value = false
    }
    const getIndexer = async (): Promise<{
        indexer: Indexer
        metadata: sequence.metadata.SequenceMetadataClient
    }> => {
        // Hardcoded useless wallet key, so that you can get into Sequence API.
        const wallet = ethers.Wallet.fromMnemonic(
            "charge era satisfy ocean inmate miracle frown slab security note cover amused"
        )
        status.value = { waitingFor: "signer_address" }
        const signerAddress = await wallet.getAddress()
        status.value = { waitingFor: "session" }
        const session = await Session.open({
            sequenceApiUrl: services.api,
            sequenceMetadataUrl: services.metadata,
            context: sequenceContext,
            networks: Object.entries(chainConfigs)
                .filter(
                    ([_, chain]) =>
                        (config.testnetModeSetMeToTheStringTrue === "true") ===
                        chain.testnet
                )
                .reduce(
                    (networks, [chainId, chain]) => [
                        ...networks,
                        { ...chain, chainId: Number.parseInt(chainId) },
                    ],
                    [] as NetworkConfig[]
                ),
            referenceSigner: signerAddress,
            signers: [
                {
                    signer: wallet,
                    weight: SignerLevel.Gold,
                },
            ],
            threshold: SignerLevel.Gold,
            metadata: {
                name: "vaportrade",
                // 1 day JWT expiry
                expiration: 60 * 60 * 24 * 1,
            },
        })
        status.value = { waitingFor: "indexer_and_metadata" }
        const [indexers, metadata] = await Promise.all([
            Promise.all(
                supportedChains.map((chainID) =>
                    session.getIndexerClient(chainID).then((indexer) => ({
                        chainID,
                        indexer,
                    }))
                )
            ).then((p) =>
                p.reduce<Indexers>((indexers, { chainID, indexer }) => {
                    indexers[chainID] = indexer
                    return indexers
                }, {} as any)
            ),
            session.getMetadataClient(),
        ])
        status.value = { waitingFor: "done" }
        console.log("metadata", metadata)
        console.log("indexer", indexers)

        //return polygon chain indexer
        sequenceApiClient.value["indexer"] = indexers[137]
        sequenceApiClient.value["metadataClient"] = metadata

        return { indexer: indexers[137], metadata }
    }
    const sendTransaction = async (
        receiverList: Receiver[],
        tokenList: TokensMerged[]
    ) => {
        const finalTokenList = tokenList.filter((token) => {
            return token.checked && token.givingEachQuantity > 0
        })
        // :todo we can also do a final check for quantity sending is it sufficient
        if (finalTokenList.length < 1) {
            await Swal.fire({
                icon: "error",
                title: "Sending no tokens!",
                text: "Aborting mission!",
            })
            return
        } else if (receiverList.length < 1) {
            await Swal.fire({
                icon: "error",
                title: "Sending to no one!",
                text: "Aborting mission!",
            })
            return
        }
        const erc1155Interface = new ethers.utils.Interface([
            "function safeBatchTransferFrom(address _from, address _to, uint256[] _id, uint256[] _value, bytes calldata _data)",
        ])
        const senderAddress = await sequenceWallet.value.getAddress()

        let transactions: { to: string; data: string }[] = []

        const skyweaverAddress: string =
            "0x631998e91476da5b870d741192fc5cbc55f5a52e"

        const tokenIds = finalTokenList.map((token) => token.tokenID)
        const amountsForEachToken = finalTokenList.map(
            (token) => token.givingEachQuantity * 100
        )
        receiverList.forEach((receiver) => {
            const functionFragment: string =
                erc1155Interface.encodeFunctionData("safeBatchTransferFrom", [
                    senderAddress,
                    receiver.account.address,
                    tokenIds,
                    amountsForEachToken,
                    "0x",
                ])
            transactions.push({ to: skyweaverAddress, data: functionFragment })
        })

        const signer = sequenceWallet.value.getSigner()
        try{
            const response = await signer.sendTransactionBatch(transactions)
            if(response.confirmations && response.confirmations >= 2){
                await Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: "Items successfully sent",
                })
                // :todo refresh user tokens
            }
            else{
                await Swal.fire({
                    icon: "error",
                    title: "Check Sequence Wallet",
                    text: "Check Sequence Wallet for transaction",
                })
            }
        }
        catch (e){
            await Swal.fire({
                icon: "error",
                title: "Not Sent",
                text: "Aborting mission!",
            })
            return
        }

    }

    return {
        sequenceWallet,
        isLoggedIn,
        sequenceApiClient,
        tokensMerged,
        status,
        connectWallet,
        disconnectWallet,
        onPageLaunch,
        getIndexer,
        sendTransaction,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSequenceStore, import.meta.hot))
}
