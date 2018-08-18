import { action, observable } from 'mobx'

class TestStore {
    @observable list = [];

    @action
    updateList = (item) => {
        this.list.push(item)    
    }
}

export default new TestStore()