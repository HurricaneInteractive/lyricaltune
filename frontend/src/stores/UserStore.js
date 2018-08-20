import { action, observable, runInAction, configure } from 'mobx'
import axios from 'axios'

configure({ enforceActions: true })

/**
 * Store to handle all user related data
 *
 * @class UserStore
 */
class UserStore {
    @observable users = null
    
    /**
     * Object containing the current user
     *
     * @default NULL
     * @memberof UserStore
     */
    @observable current_user = null

    /**
     * Authentication token - required to make calls to secure routes
     *
     * @memberof UserStore
     */
    @observable auth_token = window.sessionStorage.getItem('auth_token')

    @observable second_chance = null

    /**
     * API route prefix
     *
     * @memberof UserStore
     */
    prefix = '/users'

    axios_headers = {
        'Content-Type': 'application/json'
    }

    set__authToken(token) {
        this.auth_token = token
        window.sessionStorage.setItem('auth_token', token)
    }

    @action
    resetSecondChance() {
        this.second_chance = null
    }

    @action
    async performAPIcall(route, data = {}, method = 'GET', headers = {}) {
        const axiosHeaders = Object.assign(
            {},
            this.axios_headers,
            headers
        )

        const axios_config = {
            method: method,
            url: `${this.prefix}/${route}`,
            data: data,
            headers: axiosHeaders
        }

        return await axios(axios_config)
            .then(response => response)
            .catch(error => {
                let data = error.response.data.error
                if (data.status === 401) {
                    runInAction(() => {
                        this.second_chance = true
                    })
                    return false
                }
                else {
                    return error.response
                }
            })
    }

    @action
    async fetchUserApiData(route, headers = {}, method = 'GET') {
        const fetchHeaders = headers;
        const init = {
            method: method,
            headers: fetchHeaders
        }

        const response = await fetch(`${this.prefix}/${route}`, init)
            .then(res => res.json())
            .catch(error => error)

        if (response.error !== null) {
            if (typeof response.error.status !== 'undefined') {
                if (response.error.status === 401) {
                    runInAction(() => {
                        this.second_chance = true
                    })
                    return false
                }
            }
        }
        else {
            return response
        }
    }

    @action
    async getCurrentUser(token = this.auth_token) {
        let headers = { 'Authorization': `Bearer ${token}` }
        const response = await this.performAPIcall('current', {}, 'GET', headers)

        runInAction(() => {
            this.current_user = response.current_user
        })
    }

    @action
    async authenticateUser(email, password) {
        try {
            const response = await this.performAPIcall('login', {
                email: email,
                password: password
            }, 'post')
            
            console.log('Axios Response', response)

            runInAction(() => {
                let data = response.data
                this.current_user = data.current_user
                this.set__authToken(data.token)
            })

            return response
        }
        catch (error) {
            runInAction(() => {
                console.error('User Authentication failed', error)
            })

            return error
        }
    }

    @action
    async getUserData(username) {
        try {
            const users = await this.fetchUserApiData(username)
            runInAction(() => {
                this.users = users
            })
        }
        catch (error) {
            runInAction(() => {
                console.error('User Store Error fetching users')
            })
        }
    }
}

export default new UserStore()