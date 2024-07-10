import axios from "axios";
import {ElMessage} from 'element-plus'
import {useUserStore} from "@/stores/User.js";


axios.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            if (response.data.code === 200) {
                if (response.data.message) {
                    ElMessage.success(response.data.message)
                }
                return Promise.resolve(response);
            } else {
                ElMessage.error(response.data.message)
                return Promise.resolve(response);
            }
        }
    },
    (error) => {
        const userStore = useUserStore();
        if (error.response.status === 401) {
            ElMessage.error("身份失效，请重新登录")
            userStore.setLogout()
            return Promise.resolve({});
        } else if (error.response.status === 403) {
            ElMessage.error("权限不足，请联系管理员")
            return Promise.resolve({});
        } else {
            ElMessage.error("系统错误")
            return Promise.resolve({});
        }
    }
);

axios.interceptors.request.use(
    (config) => {
        config.headers.Authorization = localStorage.getItem("token");
        return config;
    },
    (error) => {
        ElMessage.error("系统错误")
        return Promise.resolve(error);
    }
);
