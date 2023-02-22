<script setup>
import {ref, reactive, shallowRef} from 'vue'
import {
  Fold, Expand, UserFilled, SwitchButton, Setting, User, ArrowRight, House, List, Avatar, Operation, Tickets
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
const router = useRouter()
const routes = router.getRoutes()
console.log('routes = ', routes)

const createBreadcrumbs = (routes, findId) => {
  let breadcrumbs = []
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].children.length > 0) {
      let arr = createBreadcrumbs(routes[i].children, findId)
      if (arr.length > 0) {
        breadcrumbs.push(routes[i].name, ...arr)
      }
    }
    if (routes[i].id === findId) {
      breadcrumbs.push(routes[i].name)
      return breadcrumbs
    }
  }
  return breadcrumbs
}

// console.log('store.getters.router = ', store.getters.router)

const pageObj = reactive({
  logoSwitch: true,
  routes: router.options.routes,
  asideWidth: 'auto',
  isCollapse: false,
  menus: store.getters.router,
  defaultActive: router.currentRoute.value.meta.id + '',
  breadcrumbs: createBreadcrumbs(routes, router.currentRoute.value.meta.id)
})

console.log('store.getters.router = ', store.getters.router)

const to = (path) => {
  router.push(path)
      .then(() => {
        pageObj.breadcrumbs = createBreadcrumbs(routes, router.currentRoute.value.meta.id)
      })
}

const icons = reactive({
  'User': shallowRef(User) ,
  'House': shallowRef(House),
  'Setting': shallowRef(Setting),
  'List': shallowRef(List),
  'Avatar': shallowRef(Avatar),
  'Operation': shallowRef(Operation),
  'Tickets': shallowRef(Tickets),
})

</script>

<template>
  <el-container class="layout-container" v-loading="loading">
    <el-aside :width="pageObj.asideWidth" style="border-right: 1px solid var(--el-border-color)">
      <el-header v-show="pageObj.logoSwitch" class="layout-header">
        <img style="vertical-align: middle" width="32" height="32" :src="tigers">
      </el-header>
      <el-menu
          :default-active="pageObj.defaultActive"
          :collapse="pageObj.isCollapse"
          class="layout-menu"
      >
        <template v-for="item in pageObj.menus" :key="item.id">
          <template v-if="item.children.length > 1">
            <el-sub-menu :index="item.id + ''">
              <template #title>
                <el-icon>
                  <component :is="icons[item.icon]"></component>
                </el-icon>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                  @click="to({path: item.pathStr + '/' + children.pathStr})"
                  v-for="children in item.children" :index="children.id + ''" :key="children.id">
                <el-icon>
                  <component :is="icons[children.icon]"></component>
                </el-icon>
                {{ children.name }}
              </el-menu-item>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item @click="to({path: item.children[0].pathStr})" :index="item.children[0].id + ''">
              <el-icon>
                <component :is="icons[item.icon]"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="layout-header" style="border-bottom: 1px solid var(--el-border-color);">
        <div style="float: left">
          <el-button circle @click="pageObj.isCollapse = !pageObj.isCollapse" text bg>
            <el-icon v-if="pageObj.isCollapse">
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
              <el-avatar :icon="UserFilled"/>
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
              <el-breadcrumb-item v-for="item in pageObj.breadcrumbs">{{ item }}</el-breadcrumb-item>
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

.layout-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

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


