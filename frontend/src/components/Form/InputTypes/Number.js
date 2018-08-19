import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import FormGroup from '../FormGroup'

export default class Number extends PureComponent {
    render() {
        let { name, value, required, error, onChange, attributes } = this.props
        return (
            <FormGroup label={name}>
                <input
                    type="number"
                    required={required}
                    name={name}
                    id={name}
                    value={value}
                    className={`${ error.trim() === '' ? '' : 'invalid' }`}
                    onChange={(e) => onChange(e)}
                    { ...attributes }
                />
            </FormGroup>
        )
    }
}

Number.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    attributes: PropTypes.object
}

Number.defaultProps = {
    required: false,
    error: '',
    attributes: {}
}