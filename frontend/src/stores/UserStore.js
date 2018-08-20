import { action, observable, runInAction, configure } from 'mobx'

import { performAxiosCall, fetchApiData } from '../helpers/api'

configure({ enforceActions: true })

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
     * Checks if store is giving user a second chance to log in
     *
     * @memberof UserStore
     */
    @observable second_chance = false

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

    set__authToken(token) {
        this.auth_token = token
        window.sessionStorage.setItem('auth_token', token)
    }

    @action
    set__secondChance(state) {
        this.second_chance = state
    }

    @action
    async getCurrentUser(token = this.auth_token) {
        let headers = { 'Authorization': `Bearer ${token}` }
        const response = await fetchApiData(`${this.prefix}/current`, headers, 'GET', true, this)

        console.log(response)
        runInAction(() => {
            this.current_user = response.current_user
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
}

export default new UserStore()