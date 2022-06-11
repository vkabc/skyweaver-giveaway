<script setup lang="ts">
import Rabbit from '~icons/ic/twotone-cruelty-free'
import {useSequenceStore} from "../stores/sequence";
import {fetchBalances} from "../utils/contracts";
import {normalizeAddress} from "../utils/utils";
import {onMounted} from "vue";
import {sequence} from "0xsequence";
import {useRouter} from "vue-router";

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
  const balances = await fetchBalances(indexer, normalizeAddress("0x821642365e2e3e7369e3305364c1bC0A0f585739"))
  console.log(balances)

   console.log(balances.filter((balance) =>
       balance.contractAddress === "0x631998e91476da5b870d741192fc5cbc55f5a52e"
   ))

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
