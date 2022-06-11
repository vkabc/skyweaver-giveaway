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
          Item Selection Page
        </div>
        <EmojionePartyPopper/>
      </div>
    </div>


  </div>
</template>

<style scoped>
</style>
