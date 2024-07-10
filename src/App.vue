<script setup>
import {useUserStore} from "@/stores/User.js";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";

const {isLogin} = storeToRefs(useUserStore())
const {setLogout, setLogin, me} = useUserStore()
const dialogVisible_login = ref(false)
const dialogVisible_register = ref(false)
const form = ref({
  username: '',
  password: ''
})
const login = () => {
  axios.post("http://localhost:5000/login", {
    form: form.value
  }).then((res) => {
    if (res.data.code === 200) {
      setLogin()
      me()
      localStorage.setItem("token", res.data.data.token)
      ElMessage.success("登录成功")
    }
  })

  dialogVisible_login.value = false
}
const register = () => {
  dialogVisible_register.value = false
}
</script>

<template>
  <div class="app-component">
    <div class="top-wrap">
      <el-menu
          :default-active="'/'"
          style="flex-grow: 1"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
      >
        <el-menu-item index="/">暑期集训</el-menu-item>
      </el-menu>
      <div class="top-btn-box">
        <el-button class="top-btn" v-if="!isLogin" @click="dialogVisible_login = true">登录</el-button>
        <el-button class="top-btn" v-if="!isLogin" @click="dialogVisible_register = true">注册</el-button>
        <el-button class="top-btn" v-if="isLogin" @click="setLogout">退出</el-button>
      </div>

    </div>
    <RouterView/>
    <el-dialog
        class="login-dialog"
        width="600px"
        v-model="dialogVisible_login"
        title="登录"
        :close-on-click-modal="false"
    >
      <el-form :model="form" class="login-from">
        <el-form-item label="用户名" class="from-item-inline inline-100" label-width="100px">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible_login = false">取消</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        class="register-dialog"
        width="600px"
        v-model="dialogVisible_register"
        title="注册"
        :close-on-click-modal="false"
    >
      <el-form :model="form" class="register-from">
        <el-form-item label="用户名" class="from-item-inline inline-100" label-width="100px">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible_register = false">取消</el-button>
          <el-button type="primary" @click="register">注册</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<style scoped lang="less">
.app-component {
  height: 100vh;
  background-color: #f5f5f5;
}

.top-wrap {
  display: flex;
  height: 60px;
  background-color: #545c64;
  align-items: center;

  .el-menu-demo {
    border: none;
  }

  .top-btn-box {
    .top-btn {
      margin-right: 20px;
      margin-left: 0;
    }
  }
}
</style>
