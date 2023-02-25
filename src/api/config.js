import axios from "@/utils/request";

export function remove(data) {
    return axios({
        url: '/config/remove',
        method: 'post',
        data
    })
}

export function update(data) {
    return axios({
        url: '/config/update',
        method: 'post',
        data
    })
}

export function create(data) {
    return axios({
        url: '/config/create',
        method: 'post',
        data
    })
}

export function table(data) {
    return axios({
        url: '/config/table',
        method: 'post',
        data
    })
}
