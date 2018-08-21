import React from 'react'

import Login from '../WebForms/Login'

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

    render() {
        return (
            <div className="second-chance-auth">
                <div className="inner-wrapper">
                    <p><button onClick={() => window.location = '/'}>Close</button> Closing will redirect you to the homepage</p>
                    <Login overrideSubmit={(state) => this.onSubmit(state)} />
                </div>
            </div>
        )
    }
}