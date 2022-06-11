import { createApp } from "vue"
import App from "./App.vue"
import "./index.css"
import { createPinia } from "pinia"
import IndexPage from "./pages/IndexPage.vue"
import SenderPage from "./pages/SenderPage.vue"
import * as VueRouter from "vue-router"
import { useSequenceStore } from "./stores/sequence"


const routes = [
    { path: "/", component: IndexPage },
    {
        path: "/sender",
        component: SenderPage,
        meta: { conditionalRoute: true },
    },
]
const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})

const app = createApp(App)
app.use(createPinia())

const store = useSequenceStore()
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.conditionalRoute)) {
        // this route requires condition to be accessed
        // if not, redirect to home page.
        console.log(store.isLoggedIn)
        if (!store.isLoggedIn) {
            //check codition is false
            next({ path: "/" })
        } else {
            //check codition is true
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
})
app.use(router)
app.mount("#app")
