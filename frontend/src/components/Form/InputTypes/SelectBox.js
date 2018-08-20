import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import FormGroup from '../FormGroup'

import { capitalizeFirst } from '../../../helpers/typography'

export default class SelectBox extends PureComponent {
    render() {
        let { name, value, required, error, onChange, attributes, options } = this.props
        return (
            <FormGroup label={name}>
                <select 
                    name={name}
                    id={name}
                    required={required}
                    className={`${ error.trim() === '' ? '' : 'invalid' }`}
                    onChange={(e) => onChange(e)}
                    value={value}
                    { ...attributes }
                >
                    {
                        options.map((item, i) => (
                            <option key={`${name}-${i}`} value={item}>{ capitalizeFirst(item).replace(/_/gm, ' ') }</option>
                        ))
                    }
                </select>
            </FormGroup>
        )
    }
}

SelectBox.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    attributes: PropTypes.object
}

SelectBox.defaultProps = {
    required: false,
    error: '',
    attributes: {}
}