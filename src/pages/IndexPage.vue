<script setup lang="ts">
import {useSequenceStore} from "../stores/sequence";
import ItemSelectionPage from "./ItemSelectionPage.vue"
import GuestPage from "./GuestPage.vue";


const store = useSequenceStore()

</script>

<template>

  <div v-show="store.isLoggedIn">
    <ItemSelectionPage/>
  </div>

  <div v-show="!store.isLoggedIn">
    <GuestPage/>
  </div>
</template>

<style scoped>
</style>
