import axios from "@/utils/request";

export function remove(data) {
    return axios({
        url: '/role/remove',
        method: 'post',
        data
    })
}

export function update(data) {
    return axios({
        url: '/role/update',
        method: 'post',
        data
    })
}

export function create(data) {
    return axios({
        url: '/role/create',
        method: 'post',
        data
    })
}

export function table(data) {
    return axios({
        url: '/role/table',
        method: 'post',
        data
    })
}
