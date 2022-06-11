<script setup lang="ts">
import EmojionePartyPopper from '~icons/emojione/party-popper'
import {useSequenceStore} from "../stores/sequence";


const store = useSequenceStore()

</script>

<template>

  <div class="grid place-items-center ">

    <div class="mb-4">
      <div class="lg:text-7xl md:text-5xl sm:text-3xl text-2xl font-extrabold flex mt-20">
        <div class="mr-4 text-gray-800">
          Giveaway for Skyweaver!
        </div>
        <EmojionePartyPopper/>
      </div>
    </div>

    <button @click="store.connectWallet"
            class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white ">
          <span
              class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
            Connect to wallet to start!
          </span>
    </button>

  </div>
</template>

<style scoped>
</style>
