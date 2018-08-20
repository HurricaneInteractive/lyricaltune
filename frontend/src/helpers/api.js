import axios from 'axios'

/**
 * If a request returns a 401, it will set the second_chance variable to true,
 * otherwise it will simply return the error response
 * 
 * @param {Store} store MobX Store to access
 * @param {object} response axios/fetch request response object
 * @param {string} type fetch type - defaults to `axios`
 */
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

/**
 * Performs a axios request method
 * 
 * @param {string} route Endpoint url
 * @param {object} data Data to pass to the endpoint - defaults to `{}`
 * @param {string} method Request method - defaults to `GET`
 * @param {object} headers Request headers - defaults to `{}`
 * @param {boolean} secondChance Whether the request should give the user a second chance to login - defaults to `false`
 * @param {Store} store MobX Store reference - defaults to `null`
 */
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

/**
 * Performs a fetch request
 * 
 * @param {string} route Endpoint url
 * @param {object} headers Request headers - defaults to `{}`
 * @param {string} method Request method - defaults to `GET`
 * @param {boolean} secondChance Whether the request should give the user a second chance to login - defaults to `false`
 * @param {Store} store MobX Store reference - defaults to `null`
 */
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