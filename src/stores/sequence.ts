import { acceptHMRUpdate, defineStore } from "pinia"
import { Ref, ref, watch } from "vue"
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
import { fetchBalances } from "../utils/contracts"

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
        },
    )
    const tokensMerged = ref([] as TokensMerged[])

    const isLoggedIn = ref(false)
    const sequenceWallet = ref(new sequence.Wallet("polygon"))
    const status = ref({ waitingFor: "signer" })
    const receiverList: Ref<Receiver[]> = ref([])
    watch(isLoggedIn, async (newIsLoggedIn, oldIsLoggedIn) => {
        if (newIsLoggedIn) {
            await fetchTokenBalances()
        }
    })
    const onPageLaunch = () => {
        isLoggedIn.value = sequenceWallet.value.isConnected()
        receiverList.value = [

            {"account":{"address":"0x906cf8372989d8ec534ae83999eec3109","name":"yittttDemo"}},

            {"account":{"address":"0x6e8263972989d8ec534ae828827937a10a","name":"yessDemo"}},

            ]

        tokensMerged.value = [
          {
            "contractType": "ERC1155",
            "contractAddress": "0x631998e91476da5b870d741192fc5cbc55f5a52e",
            "accountAddress": "0x3fc3973f8b82ef38857e34356fb9e00108bb5c80",
            "tokenID": "131093",
            "balance": "400",
            "blockHash": "0x42b43670f297a837549d295c154375aa79ec9ef2925b43c8b31212be0eaac26c",
            "blockNumber": 31591649,
            "chainId": 137,
            "tokenId": "131093",
            "name": "Psyche (Gold)",
            "description": "Summon: The enemy draws a card.\n\n\"Such creatures stalk the dreamfield, hunting minds fat with wisdom, and laden with secrets.\" - Lotus",
            "image": "https://assets.skyweaver.net/nUHpx2Yv/webapp/cards/full-cards/en/6x/21-gold.png",
            "decimals": 2,
            "properties": {
                "Artist: shapo": { "name": "Artist", "value": "Igor Shapochkin" },
                "attachment": "Memesis",
                "baseCardId": 21,
                "cardType": "Unit",
                "element": "Mind",
                "health": 5,
                "mana": 2,
                "power": 3,
                "prism": "Strength",
                "trait: Guard": { "name": "Trait", "value": "Guard" },
                "type": "Gold",
            },
            "external_url": "https://play.skyweaver.net/card/21/gold",
            "attributes": null,
            "checked": false,
            "givingEachQuantity": 0,
        }, {
            "contractType": "ERC1155",
            "contractAddress": "0x631998e91476da5b870d741192fc5cbc55f5a52e",
            "accountAddress": "0x3fc3973f8b82ef38857e34356fb9e00108bb5c80",
            "tokenID": "132146",
            "balance": "400",
            "blockHash": "0x42b43670f297a837549d295c154375aa79ec9ef2925b43c8b31212be0eaac26c",
            "blockNumber": 31591649,
            "chainId": 137,
            "tokenId": "132146",
            "name": "Mountain Lion (Gold)",
            "description": "Banner on your cards gives your hero +2 power instead of +1 power.\n\n\"If I had nine lives, or a hundred, I would give them all in defense of those in need.\"",
            "image": "https://assets.skyweaver.net/jyhf25_r/webapp/cards/full-cards/en/6x/1074-gold.png",
            "decimals": 2,
            "properties": {
                "Artist: edsoa": { "name": "Artist", "value": "Edvan Soares" },
                "attachment": "Shield",
                "baseCardId": 1074,
                "cardType": "Unit",
                "element": "Light",
                "health": 6,
                "mana": 7,
                "power": 6,
                "prism": "Agility",
                "trait: Banner": { "name": "Trait", "value": "Banner" },
                "trait: Guard": { "name": "Trait", "value": "Guard" },
                "type": "Gold",
            },
            "external_url": "https://play.skyweaver.net/card/1074/gold",
            "attributes": null,
            "checked": false,
            "givingEachQuantity": 0,
        }, {
            "contractType": "ERC1155",
            "contractAddress": "0x631998e91476da5b870d741192fc5cbc55f5a52e",
            "accountAddress": "0x3fc3973f8b82ef38857e34356fb9e00108bb5c80",
            "tokenID": "135118",
            "balance": "200",
            "blockHash": "0x42b43670f297a837549d295c154375aa79ec9ef2925b43c8b31212be0eaac26c",
            "blockNumber": 31591649,
            "chainId": 137,
            "tokenId": "135118",
            "name": "Mulch (Gold)",
            "description": "Do 1 damage to target unit.Slay: Summon Elderwood.\n\n\"Helped fertilize the jungle.\" - Saurian Saying, meaning 'Was Eaten by Plants'",
            "image": "https://assets.skyweaver.net/IMluY5QW/webapp/cards/full-cards/en/6x/4046-gold.png",
            "decimals": 2,
            "properties": {
                "Artist: case": { "name": "Artist", "value": "Casey Edwards" },
                "baseCardId": 4046,
                "cardType": "Spell",
                "element": "Earth",
                "mana": 1,
                "prism": "Intellect",
                "type": "Gold",
            },
            "external_url": "https://play.skyweaver.net/card/4046/gold",
            "attributes": null,
            "checked": false,
            "givingEachQuantity": 0,
        }, {
            "contractType": "ERC1155",
            "contractAddress": "0x631998e91476da5b870d741192fc5cbc55f5a52e",
            "accountAddress": "0x3fc3973f8b82ef38857e34356fb9e00108bb5c80",
            "tokenID": "262150",
            "balance": "200",
            "blockHash": "0xdab3e7d279aa6b1288a1b334bd0c07a0f402d168f072fa0f2002f0bf66ccd910",
            "blockNumber": 29482513,
            "chainId": 137,
            "tokenId": "262150",
            "name": "Topaz Crystal",
            "description": "Crystals change the color of your username in-game! They reflect how long a player's been part of Skyweaver's journey and were distributed for free at Open Beta on February 8, 2022. The Topaz Crystal was distributed to players who joined during Soft Launch between November 25, 2021 and February 7th, 2022 and reached level 5.",
            "image": "https://assets.skyweaver.net/EWxuWBFM/cosmetics/crystals/skyweaver-crystal-6.png",
            "decimals": 2,
            "properties": { "color": "#08EBDD", "type": "Crystal" },
            "attributes": null,
            "checked": false,
            "givingEachQuantity": 0,
        } ]
    }
    const connectWallet = async (): Promise<void> => {
        //await sequenceWallet.value.connect()
        isLoggedIn.value = true
    }
    const disconnectWallet = (): void => {
        sequenceWallet.value.disconnect()
        tokensMerged.value = []
        isLoggedIn.value = false
    }
    const getIndexer = async (): Promise<{
        indexer: Indexer
        metadata: sequence.metadata.SequenceMetadataClient
    }> => {
        // Hardcoded useless wallet key, so that you can get into Sequence API.
        const wallet = ethers.Wallet.fromMnemonic(
            "charge era satisfy ocean inmate miracle frown slab security note cover amused",
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
                        chain.testnet,
                )
                .reduce(
                    (networks, [chainId, chain]) => [
                        ...networks,
                        { ...chain, chainId: Number.parseInt(chainId) },
                    ],
                    [] as NetworkConfig[],
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
                    })),
                ),
            ).then((p) =>
                p.reduce<Indexers>((indexers, { chainID, indexer }) => {
                    indexers[chainID] = indexer
                    return indexers
                }, {} as any),
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
        tokenList: TokensMerged[],
    ) => {
        alert('demo ended')
    }

    const fetchTokenBalances = async () => {
        //sequence indexer and metadataClient has not been initialized
        if (Object.keys(sequenceApiClient.value).length == 0) {
            await getIndexer()
        }

        const skyweaverAddress: string =
            "0x631998e91476da5b870d741192fc5cbc55f5a52e"

        if (sequenceWallet.value.isConnected()) {
            const session = sequenceWallet.value.getSession()
            if (session !== undefined && session.accountAddress !== undefined) {
                const balances = await fetchBalances(
                    sequenceApiClient.value.indexer as Indexer,
                    normalizeAddress(session.accountAddress),
                )

                console.log(balances)

                const skyweaverTokens = balances.filter(
                    (balance) => balance.contractAddress === skyweaverAddress,
                )
                console.log(skyweaverTokens)
                const tokenMetadata =
                    await sequenceApiClient.value.metadataClient.getTokenMetadata(
                        {
                            chainID: "137",
                            contractAddress: normalizeAddress(skyweaverAddress),
                            tokenIDs: skyweaverTokens.map(
                                (token) => token.tokenID,
                            ),
                        },
                    )
                console.log(tokenMetadata)
                const tokensWithData = skyweaverTokens.map((v) => {
                    return {
                        ...v,
                        ...tokenMetadata.tokenMetadata.find(
                            (metadata) => metadata.tokenId === v.tokenID,
                        ),
                        checked: false,
                        givingEachQuantity: 0,
                    }
                })
                console.log("tokensMerged", tokensMerged)
                tokensMerged.value = tokensWithData
            }
        }
    }

    return {
        sequenceWallet,
        isLoggedIn,
        sequenceApiClient,
        tokensMerged,
        status,
        receiverList,
        connectWallet,
        disconnectWallet,
        onPageLaunch,
        getIndexer,
        sendTransaction,
        fetchTokenBalances,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSequenceStore, import.meta.hot))
}
