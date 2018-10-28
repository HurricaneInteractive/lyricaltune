import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { validatePassword, validateUsername } from '../../helpers/forms'
import { removeUnderscore } from '../../helpers/typography'

import Form from '../Form/Form'

export default class Register extends Component {
    constructor() {
		super()
		this.state = {
            name: '',
            username: '',
			email: '',
            password: '',
            confirm_password: '',
            errors: {}
		}
    }
    
    onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
    }

    setErrors = (keys, message) => {
        let errors = this.state.errors
        if (typeof keys === 'string') {
            errors[keys] = message
        }
        else {
            keys.forEach(key => {
                errors[key] = message
            })
        }

        this.setState({
            errors: errors
        })
    }

    defaultSubmit = (e) => {
        e.preventDefault();
        if (this.props.UserStore !== null) {
            this.props.UserStore.authenticateUser(this.state.email, this.state.password)
                .then((res) => {
                    console.log('res', res)
                })
                .catch(e => console.error('Register error', e))
        }
    }

    validateBeforeSubmit = () => {
        this.setState({
            errors: {}
        })
        this.props.GlobalStore.dismissResponseError()

        let { username, password, confirm_password } = this.state;
        let { GlobalStore } = this.props

        // Ensures data
        for (const key of Object.keys(this.state)) {
            if (key === 'errors') continue;

            if (this.state[key].trim() === '') {
                GlobalStore.setResponseError({
                    message: `${removeUnderscore(key)} is required`
                });
                this.setErrors(key, `${removeUnderscore(key)} is required`)

                return false
            }
        };

        if (password !== confirm_password) {
            GlobalStore.setResponseError({
                message: `Passwords must match`
            });
            this.setErrors(['password', 'confirm_password'], 'Passwords must match')

            return false;
        }

        let passwordCheck = validatePassword(password);
        if (passwordCheck.valid !== true) {
            GlobalStore.setResponseError({
                message: passwordCheck.message
            });
            this.setErrors(['password', 'confirm_password'], passwordCheck.message)

            return false;
        }

        let usernameCheck = validateUsername(username);
        if (usernameCheck.valid !== true) {
            GlobalStore.setResponseError({
                message: usernameCheck.message
            });
            this.setErrors('username', usernameCheck.message)

            return false
        }

        alert('Valid');

        if (this.props.overrideSubmit) {
            this.props.overrideSubmit(this.state)
        }
        else {
            this.defaultSubmit();
        }
    }
    
    render() {
        const fields = [
            {
                type: 'text',
                name: 'name',
                value: this.state.name,
                error: this.state.errors.hasOwnProperty('name') ? this.state.errors['name'] : '',
                attributes: {
                    placeholder: 'Your Name',
                    required: true,
                    autoComplete: 'off'
                }
            },
            {
                type: 'text',
                name: 'username',
                value: this.state.username,
                error: this.state.errors.hasOwnProperty('username') ? this.state.errors['username'] : '',
                help: 'Do not include spaces or special characters',
                attributes: {
                    placeholder: 'Username',
                    required: true,
                    autoComplete: 'off'
                }
            },
            {
                type: 'text',
                name: 'email',
                value: this.state.email,
                error: this.state.errors.hasOwnProperty('email') ? this.state.errors['email'] : '',
                attributes: {
                    placeholder: 'Email Address',
                    required: true,
                    autoComplete: 'off'
                }
            },
            {
                type: 'text',
                name: 'password',
                value: this.state.password,
                error: this.state.errors.hasOwnProperty('password') ? this.state.errors['password'] : '',
                help: '6-100 characters with at least one number OR symbol',
                attributes: {
                    placeholder: 'Password',
                    type: 'password',
                    required: true,
                    autoComplete: 'off'
                }
            },
            {
                type: 'text',
                name: 'confirm_password',
                value: this.state.confirm_password,
                error: this.state.errors.hasOwnProperty('confirm_password') ? this.state.errors['confirm_password'] : '',
                attributes: {
                    placeholder: 'Confirm Password',
                    type: 'password',
                    required: true,
                    autoComplete: 'off'
                }
            }
        ]

        return (
            <Form
                fields={fields}
                onChange={(e) => this.onChange(e)}
                onSubmit={ () => this.validateBeforeSubmit() }
                submitButtonText="Register"
            />
        )
    }
}

Register.propTypes = {
    overrideSubmit: PropTypes.func,
    UserStore: PropTypes.any,
    GlobalStore: PropTypes.any.isRequired
}

Register.defaultProps = {
    overrideSubmit: null,
    UserStore: null
}