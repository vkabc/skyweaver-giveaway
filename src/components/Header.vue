<script setup lang="ts">
import Rabbit from '~icons/ic/twotone-cruelty-free'
import {useSequenceStore} from "../stores/sequence";
import {fetchBalances} from "../utils/contracts";
import {normalizeAddress} from "../utils/utils";
import {onMounted} from "vue";
import {sequence} from "0xsequence";
import {useRouter} from "vue-router";
import {Session} from "@0xsequence/auth";

const store = useSequenceStore()
const router = useRouter()
const toggleSignIn = async (isConnected: boolean): Promise<void> => {

  if (isConnected) {
    //store.disconnectWallet()
    await store.disconnectWallet()
    await router.push('/')
  } else {
    await store.connectWallet()
  }
}
onMounted(async () => {
  const indexer = await store.getIndexer()
  const skyweaverAddress: string = "0x631998e91476da5b870d741192fc5cbc55f5a52e"

  if (store.sequenceWallet.isConnected()) {
    const session = store.sequenceWallet.getSession()
    if (session !== undefined && session.accountAddress !== undefined) {
      const balances = await fetchBalances(indexer.indexer, normalizeAddress(session.accountAddress))

      console.log(balances)

      const skyweaverTokens = balances.filter((balance) =>
          balance.contractAddress === skyweaverAddress
      )
      console.log(skyweaverTokens)
      const tokenMetadata = await indexer.metadata.getTokenMetadata({
        chainID: "137",
        contractAddress: normalizeAddress(skyweaverAddress),
        tokenIDs: skyweaverTokens.map((token) => token.tokenID)
      })
      console.log(tokenMetadata)
      const tokensMerged = skyweaverTokens.map(v => {
        return (
            {
              ...v, ...tokenMetadata.tokenMetadata.find(metadata => metadata.tokenId === v.tokenID), checked: true,
            }
        )
      });
      console.log("tokensMerged", tokensMerged)
      store.tokensMerged = tokensMerged
    }
  }


})
</script>
<template>
  <header>
    <nav
        class="
				w-full
				bg-white
				text-gray-800
				py-4
				px-8
				border-2
				flex
				items-center
			"
    >
      <Rabbit class="mr-3"/>

      <div>
        <div class="font-bold lg:text-xl md:text-lg text-md">Skyweaver Giveaway</div>
      </div>
      <button type="button" @click="toggleSignIn(store.sequenceWallet.isConnected())"
              class=" ml-auto text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200  rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
        <div class="font-bold text-gray-700 hidden sm:block">
          {{ store.isLoggedIn ? store.sequenceWallet.session.accountAddress : "Connect wallet" }}
        </div>
        <p v-show="store.sequenceWallet.isConnected()">
          Logout
        </p>

      </button>
    </nav>

  </header>
</template>


<style scoped>

</style>
