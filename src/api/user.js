import axios from "@/utils/request";

export function userRoles(data) {
    return axios({
        url: '/user/userRoles',
        method: 'post',
        data
    })
}

export function roles(data) {
    return axios({
        url: '/user/roles',
        method: 'post',
        data
    })
}

export function remove(data) {
    return axios({
        url: '/user/remove',
        method: 'post',
        data
    })
}

export function update(data) {
    return axios({
        url: '/user/update',
        method: 'post',
        data
    })
}

export function create(data) {
    return axios({
        url: '/user/create',
        method: 'post',
        data
    })
}

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
