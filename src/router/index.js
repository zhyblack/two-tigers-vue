import {createRouter, createWebHashHistory} from 'vue-router'
import {getToken} from '@/utils/localStorage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const whiteList = ['/login']

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/login',
        component: () => import('@/views/login/index.vue')
    }]
})

const modules = import.meta.glob('@/views/**')

const routesCreate = (routes) => {
    for (let i = 0; i < routes.length; i++) {
        let r = routes[i]
        r.meta = {
            ...r
        }
        if (r.redirectStr) {
            r.redirect = r.redirectStr
        }
        r.path = r.pathStr
        if (r.componentStr === 'layout') {
            r.component = () => import('@/layout/index.vue')
        } else {
            r.component = modules[`/src/views/${r.componentStr}.vue`]
        }
        if (r.children.length > 0) {
            routesCreate(r.children)
        }
        if (r.authType === 1) {
            r.children = []
        }
        if (r.pid === 0) {
            router.addRoute(r)
        }
    }
}

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const token = getToken()
    if (token) {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            if (store.getters.router.length > 0) {
                next()
            } else {
                const response = await store.dispatch('userInfo')
                store.commit('SetRouter', JSON.parse(JSON.stringify(response.routes)))
                routesCreate(response.routes)
                next({...to, replace: true})
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

router.afterEach(() => {
    NProgress.done()
})

export default router
