import {createRouter, createWebHashHistory} from 'vue-router'
import {getToken} from '@/utils/localStorage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const layout = () => import('@/layout/index.vue')

const whiteList = ['/login']

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        component: layout,
        redirect: '/dashboard',
        children: [{
            path: '/dashboard',
            component: () => import('@/views/dashboard/index.vue')
        }]
    }, {
        path: '/system',
        component: layout,
        children: [{
            path: 'user',
            component: () => import('@/views/system/user/index.vue')
        }, {
            path: 'role',
            component: () => import('@/views/system/role/index.vue')
        }, {
            path: 'auth',
            component: () => import('@/views/system/auth/index.vue')
        }, {
            path: 'config',
            component: () => import('@/views/system/config/index.vue')
        }]
    }, {
        path: '/login',
        component: () => import('@/views/login/index.vue')
    }]
})

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    console.log("to = ", to)
    console.log("from = ", from)
    const token = getToken()
    console.log("token = ", token)
    if (token) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            try {
                const res = await store.dispatch('userInfo')
                console.log(res)
                next()
            } catch (e) {

            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

console.log('roter init')

router.afterEach(() => {
    NProgress.done()
})
export default router
