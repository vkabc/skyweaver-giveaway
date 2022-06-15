import { sequence } from "0xsequence"
import { blacklistedContracts } from "./verified"

import {
    ContractType as SequenceContractType, Indexer,
    TokenBalance,
} from "@0xsequence/indexer"
import { isSupportedChain } from "./multichain"
import { normalizeAddress } from "./utils"

export async function fetchBalances(
    indexer: Indexer,
    accountAddress: string
): Promise<Array<TokenBalance>> {
    const balances = (
        await indexer.getTokenBalances({
            accountAddress,
        })
    ).balances.filter(
        (b) =>
            !isSupportedChain(b.chainId) ||
            !blacklistedContracts[b.chainId].has(
                normalizeAddress(b.contractAddress)
            )
    )
    const etherBalance = await indexer.getEtherBalance({ accountAddress })

    balances.push({
        accountAddress,
        balance: etherBalance.balance.balanceWei,
        blockHash: "",
        blockNumber: 0,
        chainId: (await indexer.getChainID()).chainID,
        contractAddress: "0x0000000000000000000000000000000000000000", // native token
        contractType: SequenceContractType.UNKNOWN,
        id: 0,
        tokenID: "0",
        updateId: 0,
    })
    const extraBalances = await Promise.all(
        balances
            .filter(
                (b) =>
                    b.contractType === "ERC1155" || b.contractType === "ERC721"
            )
            .map((balance) =>
                indexer
                    .getTokenBalances({
                        accountAddress,
                        contractAddress: balance.contractAddress,
                    })
                    .then((b) => b.balances)
            )
    )
    return [
        ...balances.filter(
            (b) => b.contractType !== "ERC1155" && b.contractType !== "ERC721"
        ),
        ...extraBalances.flat(),
    ]
}
