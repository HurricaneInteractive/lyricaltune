import { action, observable, runInAction, configure, computed } from 'mobx'

import { performAxiosCall, fetchApiData } from '../helpers/api'

import globalStore from './GlobalStore'

configure({ enforceActions: 'always' })

/**
 * Store to handle all user related data
 *
 * @class UserStore
 */
class UserStore {
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

    /**
     * Default headers for axios calls
     *
     * @memberof UserStore
     */
    axios_headers = {
        'Content-Type': 'application/json'
    }

    @computed get axiosHeaders() {
        return {
            ...this.axios_headers,
            'Authorization': `Bearer ${this.auth_token}`
        }
    }

    @computed get globalstore() {
        return this.global_store
    }

    constructor(globalStore) {
        this.global_store = globalStore
    }

    set__authToken(token) {
        this.auth_token = token
        window.sessionStorage.setItem('auth_token', token)
    }

    @action
    async getCurrentUser(token = this.auth_token, secondChance = false) {
        let headers = { 'Authorization': `Bearer ${token}` }
        const response = await fetchApiData(`${this.prefix}/current`, headers, 'GET', secondChance, this.global_store)

        console.log(response)
        runInAction(() => {
            if (response.error === null || typeof response.error === 'undefined') {
                this.current_user = response.current_user
            }
        })
    }

    @action
    async authenticateUser(email, password) {
        try {
            const response = await performAxiosCall(`${this.prefix}/login`, {
                email: email,
                password: password
            }, 'post', this.axios_headers)
            
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
    async followUser(id) {
        try {
            let headers = this.axios_headers
            if (this.auth_token !== '' && this.auth_token !== null) {
                headers['Authorization'] = `Bearer ${this.auth_token}`
            }

            const response = await performAxiosCall(`${this.prefix}/follow`, {
                id: id
            }, 'post', headers, false, this.global_store)

            console.log(response)
        }
        catch (error) {
            this.global_store.setResponseError(error)
        }
    }

    @action
    async registerUser(data) {
        try {
            let headers = this.axios_headers
            const response = await performAxiosCall(`${this.prefix}/register`, data, 'post', headers, false, this.global_store)

            // console.log(response);
            runInAction(() => {
                let data = response.data
                if (data.error === null) {
                    this.current_user = data.current_user
                    this.set__authToken(data.token)
                }
            })

            return response
        }
        catch(error) {
            this.global_store.setResponseError(error)
        }
    }
}

export default new UserStore(globalStore)