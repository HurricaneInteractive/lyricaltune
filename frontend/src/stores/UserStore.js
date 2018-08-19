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
    async performAPIcall(route, data = {}, method = 'GET', headers = {}) {
        const axiosHeaders = Object.assign(
            {},
            this.axios_headers,
            headers
        )

        const response = await axios({
            method: method,
            url: `${this.prefix}/${route}`,
            data: data,
            headers: axiosHeaders
        })
        .then(response => response)
        .catch(error => error)

        return response
    }

    @action
    async fetchUserApiData(route, headers = {}) {
        const fetchHeaders = headers;
        const init = {
            method: 'GET',
            headers: fetchHeaders
        }

        const response = await fetch(`${this.prefix}/${route}`, init)
            .then(res => res.json())
            .catch(error => error)

        return response
    }

    @action
    async authenticateUser(email, password) {
        try {
            const response = await this.performAPIcall('login', {
                email: email,
                password: password
            }, 'post')

            runInAction(() => {
                let data = response.data
                this.current_user = data.current_user
                this.set__authToken(data.token)
            })
        }
        catch (error) {
            runInAction(() => {
                console.error('User Authentication failed', error)
            })
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