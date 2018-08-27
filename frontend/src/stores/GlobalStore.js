import { action, observable, computed } from 'mobx'

class GlobalStore {
    @observable second_chance = false
    @observable response_error = null

    @action
    setSecondChance(state) {
        this.second_chance = state
    }

    @action
    setResponseError(error) {
        console.log(error)
        this.response_error = error
    }

    @action
    dismissResponseError() {
        this.response_error = null
    }

    @computed get errors() {
        return this.response_error
    }
}

export default new GlobalStore()