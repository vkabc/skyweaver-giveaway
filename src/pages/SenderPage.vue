<script setup lang="ts">
import EmojionePartyPopper from '~icons/emojione/party-popper'
import {useSequenceStore} from "../stores/sequence";
import {onMounted, Ref, ref} from "vue";
import {debounce} from 'lodash'


const store = useSequenceStore()

const isUserFound = ref(false)
const searchUserInputBox = ref("")
const searchResultCount = ref(-1)
const userDetails: Ref<{ account: {} }> = ref({account: {}})
const receiverList: Ref<{ account: {} }[]> = ref([])
const addUser = debounce(() => {
  receiverList.value.push(userDetails.value)
  userDetails.value = {account: {}}
  searchResultCount.value = -1
  searchUserInputBox.value.value = ""
  isUserFound.value = false
}, 0)

const onInput = debounce(async (e) => {

  const searchInput = e.target.value.toLowerCase()
  const options = {
    method: 'POST',
    headers: {
      'Content-Type':
          'application/json'
    },
    body: JSON.stringify({req: {gameMode: "RANKED_CONSTRUCTED", playerRank: "UNKNOWN", playerNamePrefix: searchInput}})
  }
  const response = await fetch('https://api.skyweaver.net/rpc/SkyWeaverAPI/ListLeaderboard', options)
  const responseBody = await response.text()
  const result = JSON.parse(responseBody).res
  if (result.length === 1 || result[0].account.name.toLowerCase() === searchInput) {
    userDetails.value = result[0]
    isUserFound.value = true
    console.log("userDetails", userDetails)
  } else {
    isUserFound.value = false
  }
  searchResultCount.value = result.length
}, 500)


const toggleItemSelection = (tokenID: string) => {
  store.tokensMerged = store.tokensMerged.filter(token => token.tokenID !== tokenID)

}
</script>

<template>

  <div class="grid place-items-center  ">

    <div class="mb-4">
      <div class="lg:text-7xl md:text-5xl sm:text-3xl text-2xl font-extrabold flex mt-20">
        <div class="mr-4 mb-8 text-gray-800">
          Send To Selection
        </div>
        <EmojionePartyPopper/>
      </div>

      <form class="flex items-center mb-10 ">
        <div class="flex-grow">
          <label for="voice-search" class="sr-only">Search</label>
          <div class="relative w-full">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"></path>
              </svg>
            </div>
            <input type="text" id="voice-search" @input="onInput" ref="searchUserInputBox"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="Search Skyweaver Users" required>
            <button type="button" class="flex absolute inset-y-0 right-0 items-center pr-3">
              <svg class="w-4 h-4 text-gray-500 hover:text-gray-900" xmlns="http://www.w3.org/2000/svg"
                   xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em"
                   preserveAspectRatio="xMidYMid meet"
                   viewBox="0 0 24 24"
                   style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/>
              </svg>
            </button>

          </div>
          <div class="absolute ">
            <p v-if="isUserFound" class="ml-2 mt-2 text-sm text-green-600 dark:text-green-500">User
              {{ userDetails.account.name }} is found with
              address:
              {{ userDetails.account.address }}</p>
            <p v-show="searchResultCount === 0" class="ml-2 mt-2 text-sm text-red-600 dark:text-red-500"><span
                class="font-bold">Oh, snapp!</span>
              User not
              found</p>
          </div>
        </div>
        <button @click="addUser" :disabled="!isUserFound"
                :class="{' bg-gray-600 hover:bg-gray-600': !isUserFound}"
                class="inline-flex  py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
          <!--        <svg class="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"-->
          <!--             xmlns="http://www.w3.org/2000/svg">-->
          <!--          <path   stroke-width="3"-->
          <!--                d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"></path>-->
          <!--        </svg>-->
          <svg class="mr-1 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"
               style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);">
            <path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/>
          </svg>
          Add
        </button>
      </form>

      <ul>
        <li v-for="receiver in receiverList " @click="toggleItemSelection(token.tokenID)"
            class="mb-2 rounded-xl bg-gradient-to-r bg-white border border-gray-200 p-2 sm:p-6 hover:bg-gray-100 ">
          <div class="flex">

            <div class="ml-2 text-sm">
              <label
                  class="font-medium text-gray-900 dark:text-gray-300">{{ receiver.account.name }}</label>
              <p id="helper-checkbox-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
                {{ receiver.account.address }}</p>
            </div>

            <div class="flex items-center h-5 ml-auto">
              <button type="button"
                      class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                </svg>
              </button>

            </div>
          </div>
        </li>
      </ul>

      <div class="font-bold text-xl mr-4 mb-8 mt-5 text-gray-800">
        Choose Quantity
      </div>

      <ul>
        <li v-for="token in store.tokensMerged.filter((theToken) => theToken.checked) "
            class="mb-2 rounded-xl bg-gradient-to-r bg-white border border-gray-200 p-2 sm:p-6 hover:bg-gray-100 ">
          <div class="flex">

            <div class="w-[48px] h-[48px]">
              <img class="object-scale-down w-[48px] h-[48px]" :src="token.image">
            </div>
            <div class="ml-2 text-sm">
              <label
                  class="font-medium text-gray-900 dark:text-gray-300">{{ token.name }}</label>
              <p id="helper-checkbox-text" class="text-xl font-bold text-gray-500 dark:text-gray-300">
                {{0}}x{{receiverList.length}} person/{{ token.balance / 100 }}</p>
            </div>

            <div class="flex items-center h-5 ml-auto">

              <button type="button" class="inset-y-0 right-0 items-center pr-3" @click="toggleItemSelection(token.tokenID)">
                <svg class="w-4 h-4 text-gray-500 hover:text-gray-900" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em"
                     preserveAspectRatio="xMidYMid meet"
                     viewBox="0 0 24 24"
                     style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/>
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>




  </div>
</template>

<style scoped>
</style>
