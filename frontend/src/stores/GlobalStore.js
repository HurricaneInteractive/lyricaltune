import { action, observable } from 'mobx'

class GlobalStore {
    @observable second_chance = false

    @action
    setSecondChance(state) {
        this.second_chance = state
    }
}

export default new GlobalStore()