import axios from '@/utils/request'
export function dictTable(query) {
    return axios({
        url: '/dict/table',
        method: 'post',
        data: query
    })
}

export function create(data) {
    return axios({
        url: '/dict/create',
        method: 'post',
        data
    })
}
