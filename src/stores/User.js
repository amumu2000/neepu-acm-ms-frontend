import {ref} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";
import router from "@/router/index.js";

export const useUserStore = defineStore('user', () => {
    const isLogin = ref(false)
    const detail = ref({})
    const me = () => {
        axios.post("http://localhost:5000/me", localStorage.getItem("token")).then((res) => {
            if (res.data.code === 200) {
                isLogin.value = true
                detail.value = res.data.data.detail
            } else {
                isLogin.value = false
            }
        })
    }
    if (localStorage.getItem("token")) {
        isLogin.value = true
        me()
    }

    const setLogin = () => {
        isLogin.value = true
    }
    const setLogout = () => {
        isLogin.value = false
        detail.value = {}
        localStorage.removeItem("token");
        router.push("/");
    }
    return {isLogin, detail, setLogin, setLogout, me}
})
