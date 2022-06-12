<script setup lang="ts">
import EmojionePartyPopper from '~icons/emojione/party-popper'
import {useSequenceStore} from "../stores/sequence";
import {computed} from "vue";
import {fetchBalances} from "../utils/contracts";
import {normalizeAddress} from "../utils/utils";
import {Indexer} from "@0xsequence/indexer";
import {sequence} from "0xsequence";


const store = useSequenceStore()

const toggleItemSelection = (tokenID: string) => {
  const token = store.tokensMerged.find(token => token.tokenID === tokenID)
  if (token !== undefined) {
    console.log(token.checked)
    token.checked = !token.checked;
    console.log(token.checked)
  }

}

</script>

<template>

  <div class="grid place-items-center ">

    <div class="mb-4">
      <div class="lg:text-7xl md:text-5xl sm:text-3xl text-2xl font-extrabold flex mt-20">
        <div class="mr-4 text-gray-800">
          Item Selection Page
        </div>

        <EmojionePartyPopper/>
      </div>

      <!--       :todo indexer loading-->
      <div v-if="store.status.waitingFor !== 'done'">
        {{ store.status }}
      </div>

      <ul class="mb-4">
        <li v-for="token in store.tokensMerged " @click="toggleItemSelection(token.tokenID)"
            class="mb-2 rounded-xl bg-gradient-to-r bg-white border border-gray-200 p-2 sm:p-6 hover:bg-gray-100 ">
          <div class="flex">
            <div class="flex items-center h-5">

            </div>

            <div class="w-[48px] h-[48px]">
              <img class="object-scale-down w-[48px] h-[48px]" :src="token.image">
            </div>
            <div class="ml-2 text-sm">
              <label
                  class="font-medium text-gray-900 ">{{ token.name }}</label>
              <p id="helper-checkbox-text" class="text-lg font-bold text-gray-500 ">
                {{ token.balance / 100 }}</p>
            </div>

            <input :id="`helper-checkbox${token.tokenID}`" aria-describedby="helper-checkbox-text" type="checkbox"
                   value=""
                   class="ml-auto w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
                   :checked="token.checked">
          </div>
        </li>
      </ul>

      <button @click="$router.push('/sender')" type="button"
              class="w-full text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200  font-bold rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 text-gray-700">
        Continue
      </button>
    </div>


  </div>
</template>

<style scoped>
</style>
