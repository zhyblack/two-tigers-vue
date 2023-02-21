<script setup>
import {ref, reactive} from 'vue'
import {
  Fold,
  Expand,
  UserFilled,
  SwitchButton,
  Setting,
  User,
  ArrowRight,
  DataAnalysis,
  Connection
} from '@element-plus/icons-vue'
import tigers from '@/assets/tigers.png'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

const loading = ref(false)

const store = useStore()

const logout = () => {
  loading.value = true
  store.dispatch('logout')
      .then(() => {
        ElMessage({
          message: '退出成功，即将跳转登录页面。',
          type: 'success',
        })
        loading.value = false
        location.reload()
      })
      .catch(() => {
        loading.value = false
      })
}

const router = useRouter();

console.log(router.options.routes)

const isCollapse = ref(false)
const pageObj = reactive({
  logoSwitch: true,
  routes: router.options.routes,
})

const to = (path) => {
  router.push(path)
}

</script>

<template>
  <el-container class="layout-container" v-loading="loading">
    <el-aside width="auto" style="border-right: 1px solid var(--el-border-color)">
      <el-header v-show="pageObj.logoSwitch" class="layout-header">
        <img style="vertical-align: middle" width="32" height="32" :src="tigers">
      </el-header>
      <el-menu
          default-active="1"
          :collapse="isCollapse"
          class="layout-menu"
      >
        <el-menu-item @click="to({path: '/dashboard'})" index="1">
          <el-icon>
            <DataAnalysis/>
          </el-icon>
          <span>DataAnalysis</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Setting/>
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item @click="to({path: '/system/user'})" index="2-1">
            <el-icon>
              <User/>
            </el-icon>
            用户管理
          </el-menu-item>
          <el-menu-item @click="to({path: '/system/auth'})" index="3-1">
            <el-icon>
              <Connection/>
            </el-icon>
            权限管理
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="layout-header" style="border-bottom: 1px solid var(--el-border-color);">
        <div style="float: left">
          <el-button circle @click="isCollapse = !isCollapse" text bg>
            <el-icon v-if="isCollapse">
              <Expand/>
            </el-icon>
            <el-icon v-else>
              <Fold/>
            </el-icon>
          </el-button>
        </div>
        <div style="float: right;">
          <el-dropdown style="margin: 10px;">
            <span class="el-dropdown-link">
              <el-avatar :icon="UserFilled" :src="tigers"/>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="ElMessage({ message: 'nihao, fugui.', type: 'success', })">hi, fugui
                </el-dropdown-item>
                <el-dropdown-item @click="logout">
                  logout&nbsp;
                  <el-icon>
                    <SwitchButton/>
                  </el-icon>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="border-bottom: 1px solid var(--el-border-color)">
        <el-scrollbar>
          <div style="margin-bottom: 20px">
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item>/</el-breadcrumb-item>
              <el-breadcrumb-item>DataAnalysis</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view/>
        </el-scrollbar>
      </el-main>
      <el-footer class="layout-footer">
        @Copyright fugui 2023
      </el-footer>
    </el-container>
  </el-container>

</template>

<style scoped>

.el-dropdown-link:focus {
  outline: none;
}

.layout-menu {
  border: 0
}

.layout-footer {
  line-height: 60px;
  text-align: center;
}

.layout-container {
  height: 100%;
}

.layout-header {
  line-height: 60px;
  text-align: center;
}
</style>


