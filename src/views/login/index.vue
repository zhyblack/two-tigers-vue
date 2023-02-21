<script setup>
import {reactive, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {RefreshRight, Promotion} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: '111111'
})

const rules = reactive({
  username: [
    {required: true, message: 'Please input username name', trigger: 'blur'},
  ],
  password: [
    {required: true, message: 'Please input password name', trigger: 'blur'},
  ],
})

const loginForm = ref()

const store = useStore()
const router = useRouter()

const submit = (loginForm) => {
  loginForm.validate((valid) => {
    if (valid) {
      loading.value = true
      store.dispatch('login', form)
          .then(() => {
            ElMessage({
              message: '登录成功。',
              type: 'success',
            })

            // console.log("router.currentRoute.value = ", router.currentRoute.value)
            const query = Object.keys(router.currentRoute.value.query).reduce((acc, cur) => {
              if (cur !== 'redirect') {
                acc[cur] = query[cur]
              }
              return acc
            }, {})
            // console.log('query = ', query)
            router.push({path: router.currentRoute.value.query.redirect || '/', query})
            loading.value = false
          })
          .catch(() => {
            loading.value = false
          })
    }
  })
}

const resetForm = (loginForm) => {
  loginForm.resetFields()
}

</script>

<template>

  <el-container style="height: 100%">
    <el-main>
      <el-card style="width: 500px; margin: 0 auto; transform: translate(0%, 75%);">
        <template #header>
          <div>
            <span>Login Form</span>
          </div>
        </template>
        <el-form :model="form" label-width="120px" :rules="rules" ref="loginForm">
          <el-form-item label="username" prop="username">
            <el-input v-model="form.username"/>
          </el-form-item>
          <el-form-item label="password" prop="password">
            <el-input type="password" v-model="form.password"/>
          </el-form-item>
          <el-form-item>
            <el-button v-loading="loading" type="primary" @click="submit(loginForm)">
              <el-icon>
                <Promotion/>
              </el-icon>
            </el-button>
            <el-button @click="resetForm(loginForm)">
              <el-icon>
                <RefreshRight/>
              </el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
