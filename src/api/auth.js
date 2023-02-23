import axios from "@/utils/request";

export function table(data) {
    return axios({
        url: '/auth/table',
        method: 'post',
        data
    })
}

export function save(data) {
    return axios({
        url: '/auth/save',
        method: 'post',
        data
    })
}

export function update(data) {
    return axios({
        url: '/auth/update',
        method: 'post',
        data
    })
}

export function remove(data) {
    return axios({
        url: '/auth/delete',
        method: 'post',
        data
    })
}
