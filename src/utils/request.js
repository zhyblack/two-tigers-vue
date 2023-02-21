import axios from 'axios'
import {tokenKey} from '@/utils/localStorage'
import {ElMessageBox, ElMessage} from 'element-plus'
import store from '@/store'
import 'element-plus/es/components/message/style/css'
import 'element-plus/theme-chalk/index.css'

const request = axios.create({
    baseURL: '/api',
})

request.interceptors.request.use(
    config => {
        const token = store.getters.token
        if (token) {
            config.headers[tokenKey] = token
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            ElMessage({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            if (res.code === 401) {
                ElMessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err ' + error)
        ElMessage.error(error.message)
        return Promise.reject(error)
    }
)

export default request
