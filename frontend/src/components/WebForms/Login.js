import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Form from '../Form/Form'

export default class Login extends Component {
    constructor() {
		super()
		this.state = {
			email: '',
			password: ''
		}
    }
    
    onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
    }

    defaultSubmit = (e) => {
        e.preventDefault();
        if (this.props.UserStore !== null) {
            this.props.UserStore.authenticateUser(this.state.email, this.state.password)
                .then((res) => {
                    console.log('res', res)
                })
                .catch(e => console.error('Login error', e))
        }
    }
    
    render() {
        const fields = [
            {
                type: 'text',
                name: 'email',
                value: this.state.email,
                attributes: {
                    placeholder: 'Email Address'
                }
            },
            {
                type: 'text',
                name: 'password',
                value: this.state.password,
                attributes: {
                    placeholder: 'Password',
                    type: 'password'
                }
            }
        ]

        return (
            <Form
                fields={fields}
                onChange={(e) => this.onChange(e)}
                onSubmit={ this.props.overrideSubmit === null ? () => alert('normal submit') : () => this.props.overrideSubmit(this.state) }
            />
        )
    }
}

Login.propTypes = {
    overrideSubmit: PropTypes.func,
    UserStore: PropTypes.any
}

Login.defaultProps = {
    overrideSubmit: null,
    UserStore: null
}