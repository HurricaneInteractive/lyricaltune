import React from 'react'

import Login from '../WebForms/Login'
import Modal from '../Modal'

export default class SecondChanceAuth extends React.Component {

    onSubmit = (state) => {
        const { UserStore, GlobalStore } = this.props
        UserStore.authenticateUser(state.email, state.password)
            .then(response => {
                if (response.data.error === null) {
                    alert('You are now logged in')
                    GlobalStore.setSecondChance(false)
                }
            })
            .catch(e => {
                console.error(e)
            })
    }

    close = (e) => {
        e.preventDefault();
        this.props.GlobalStore.setSecondChance(false);
    }

    render() {
        return (
            <Modal close={(e) => this.close(e)}>
                <h2 className="text--center c-dark-blue">Login</h2>
                <Login overrideSubmit={(state) => this.onSubmit(state)} />
            </Modal>
        )
    }
}