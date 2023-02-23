import axios from "@/utils/request";

export function userInfo() {
    return axios({
        url: '/user/info',
        method: 'post',
    })
}

export function table(data) {
    return axios({
        url: '/user/table',
        method: 'post',
        data
    })
}

export function login(user) {
    return axios({
        url: '/login',
        method: 'post',
        data: user
    })
}

export function logout() {
    return axios({
        url: '/logout',
        method: 'post'
    })
}
