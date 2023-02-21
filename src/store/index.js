import {createStore} from 'vuex'
import {getToken, setToken, removeToken} from '@/utils/localStorage'
import {login, logout, userInfo} from '@/api/user'

const store = createStore({
    state() {
        return {
            user: {
                token: getToken(),
                router: []
            }
        }
    },
    getters: {
        token(state) {
            return state.user.token
        }
    },
    mutations: {
        SetToken: (state, token) => {
            state.user.token = token
            setToken(token)
        }
    },
    actions: {
        userInfo({}) {
            return new Promise((resolve, reject) => {
                userInfo().then(response => {
                    const {data} = response
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        login({commit}, user) {
            return new Promise((resolve, reject) => {
                login(user).then(response => {
                    const {data} = response
                    commit('SetToken', data.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        resetToken({commit}) {
            return new Promise(resolve => {
                commit('SetToken', '')
                removeToken()
                resolve()
            })
        },
        logout({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SetToken', '')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})

export default store
