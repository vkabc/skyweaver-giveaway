import { acceptHMRUpdate, defineStore } from "pinia"
import { ref } from "vue"
import { ethers } from "ethers"
import { Session } from "@0xsequence/auth"
import { chainConfigs, Indexers, supportedChains } from "../utils/multichain"
import { sequenceContext, NetworkConfig } from "@0xsequence/network"
import { config } from "../utils/settings"
import { Indexer } from "@0xsequence/indexer"
import { sequence } from "0xsequence"

export const services = {
    api: `https://api.sequence.app`,
    metadata: `https://metadata.sequence.app`,
} as const

enum SignerLevel {
    Gold = 3,
    Silver = 2,
    Bronze = 1,
}

export const useSequenceStore = defineStore("sequence", () => {
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
    const getIndexer = async (): Promise<Indexer> => {
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
        console.log("metadata", metadata)
        console.log("indexer", indexers)
        //return polygon chain indexer
        return indexers[137]
    }

    return { sequenceWallet, isLoggedIn, connectWallet, disconnectWallet, onPageLaunch,  getIndexer }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSequenceStore, import.meta.hot))
}
