import React from 'react'
import PropTypes from 'prop-types'

import Form from '../Form/Form'

export default class Login extends React.Component {
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
    
    render() {
        const fields = [
            {
                type: 'text',
                name: 'email',
                value: this.state.email
            },
            {
                type: 'text',
                name: 'password',
                value: this.state.password
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
    overrideSubmit: PropTypes.func
}

Login.defaultProps = {
    overrideSubmit: null
}