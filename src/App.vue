<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import GuestPage from './pages/GuestPage.vue'
import Header from './components/Header.vue'

import {useSequenceStore} from "./stores/sequence";

const store = useSequenceStore()
store.onPageLaunch()
</script>

<template>
  <Header/>
  <router-view></router-view>
</template>

<style>
</style>
