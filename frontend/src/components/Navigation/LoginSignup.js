import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Login from '../WebForms/Login'
import Register from '../WebForms/Register'
import Modal from '../Modal'

export default class LoginSignup extends Component {
    constructor() {
        super()
        
        this.state = {
            loginOpen: false,
            registerOpen: false
        }
    }

    triggerModal = (e, key) => {
        e.preventDefault()
        let currentState = this.state[key]
        this.setState({
            [key]: !currentState,
            [key === 'loginOpen' ? 'registerOpen' : 'loginOpen']: false
        })
    }

    loginUser = (values) => {
        this.props.UserStore.authenticateUser(values.email, values.password)
            .then((res) => {
                if (res.data.error === null) {
                    
                }
            })
            .catch(e => console.error('Login Error', e))
    }

    registerUser = (values) => {
        // console.log('Register', values);
        this.props.UserStore.registerUser(values)
            .then(res => {
                // console.log(res)
            })
            .catch(e => console.error('Register Error', e))
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.loginOpen ? (
                        <Modal close={(e) => this.triggerModal(e, 'loginOpen')}>
                            <h2 className="text--center c-dark-blue">Login</h2>
                            <Login
                                overrideSubmit={(values) => this.loginUser(values)}
                            />
                        </Modal>
                    ) : ('')
                }
                {
                    this.state.registerOpen ? (
                        <Modal close={(e) => this.triggerModal(e, 'registerOpen')}>
                            <h2 className="text--center c-dark-blue">Register</h2>
                            <Register overrideSubmit={(values) => this.registerUser(values)} GlobalStore={this.props.GlobalStore} />
                        </Modal>
                    ) : ('')
                }
                <li><a href="#login-modal" onClick={(e) => this.triggerModal(e, 'loginOpen')}>Log In</a></li>
                <li><a href="#register-modal" onClick={(e) => this.triggerModal(e, 'registerOpen')}>Sign Up</a></li>
            </Fragment>
        )
    }
}

LoginSignup.propTypes = {
    UserStore: PropTypes.any.isRequired,
    GlobalStore: PropTypes.any.isRequired
}