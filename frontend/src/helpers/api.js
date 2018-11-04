import axios from 'axios'

const base_url = "https://cors-anywhere.herokuapp.com/https://lyricalapi.herokuapp.com"

/**
 * If a request returns a 401, it will set the second_chance variable to true,
 * otherwise it will simply return the error response
 * 
 * @param {Store} store MobX Store to access
 * @param {object} response axios/fetch request response object
 * @param {string} type fetch type - defaults to `axios`
 */
export const enableSecondChance = (store, response, type = 'axios') => {
    let status = null,
        error = null
    switch(type) {
        case 'fetch':
            if (response.error !== null && typeof response.error !== 'undefined') {
                if (typeof response.error.status !== 'undefined') {
                    status = response.error.status
                    error = response.error
                }
            }
            break;
        case 'axios':
        default:
            status = response.data.error.status
            error = response.data.error
            break
    }

    if (status === 401) {
        store.setSecondChance(true)
        return false
    }
    else {
        if (error !== null) {
            store.setResponseError(error)
            return false
        } else {
            return response
        }
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
        url: `${base_url}${route}`,
        data: data,
        headers: headers
    }

    return await axios(config)
        .then(response => response)
        .catch(error => {
            if (store !== null && secondChance === true) {
                return enableSecondChance(store, error.response, 'axios')
            }
            else {
                // error checking and set store response errors to errors
                console.log(error.response)
                let errors = error.response.data.error
                store.setResponseError(errors)
                return false
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

    const response = await fetch(`${base_url}${route}`, init)
        .then(res => res.json())
        .catch(error => error)

    if (store !== null && secondChance === true) {
        return enableSecondChance(store, response, 'fetch')
    }
    else {
        // error checking and set store response errors to errors
        return response
    }
}