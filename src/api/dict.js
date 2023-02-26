import axios from '@/utils/request'

export function listTypes(data) {
    return axios({
        url: '/dict_list/types',
        method: 'post',
        data
    })
}

export function listUpdate(data) {
    return axios({
        url: '/dict_list/update',
        method: 'post',
        data
    })
}

export function listCreate(data) {
    return axios({
        url: '/dict_list/create',
        method: 'post',
        data
    })
}

export function listTable(data) {
    return axios({
        url: '/dict_list/table',
        method: 'post',
        data
    })
}

export function dictTable(data) {
    return axios({
        url: '/dict/table',
        method: 'post',
        data
    })
}

export function create(data) {
    return axios({
        url: '/dict/create',
        method: 'post',
        data
    })
}

export function update(data) {
    return axios({
        url: '/dict/update',
        method: 'post',
        data
    })
}

export function remove(data) {
    return axios({
        url: '/dict/remove',
        method: 'post',
        data
    })
}
