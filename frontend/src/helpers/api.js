import axios from 'axios'

export const enableSecondChance = (store, response, type = 'axios') => {
    let status = null;
    switch(type) {
        case 'fetch':
            if (response.error !== null) {
                if (typeof response.error.status !== 'undefined') {
                    status = response.error.status
                }
            }
            break;
        case 'axios':
        default:
            status = response.data.error.status
            break
    }

    if (status === 401) {
        store.set__secondChance(true)
        return false
    }
    else {
        return response
    }
}

export const performAxiosCall = async (route, data = {}, method = 'GET', headers = {}, secondChance = false, store = null) => {
    const config = {
        method: method,
        url: route,
        data: data,
        headers: headers
    }

    return await axios(config)
        .then(response => response)
        .catch(error => {
            if (store !== null) {
                return secondChance ? enableSecondChance(store, error.response, 'axios') : error.response
            }
            else {
                return error.response
            }
        })
}

export const fetchApiData = async (route, headers = {}, method = 'GET', secondChance = false, store = null) => {
    const init = {
        method: method,
        headers: headers
    }

    const response = await fetch(route, init)
        .then(res => res.json())
        .catch(error => error)

    if (store !== null) {
        return secondChance ? enableSecondChance(store, response, 'fetch') : response
    }
    else {
        return response
    }
}