import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/User.js";
import {ElMessage} from "element-plus";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcomeView',
            component: WelcomeView
        },
        {
            path: '/home',
            name: 'home',
            beforeEnter: (to, from, next) => {
                const {isLogin} = storeToRefs(useUserStore())
                if (!isLogin.value) {
                    ElMessage.warning("请先登录")
                    next('/')
                } else {
                    next()
                }
            },
            component: () => import('../views/HomeView.vue')
        }
    ]
})

export default router
