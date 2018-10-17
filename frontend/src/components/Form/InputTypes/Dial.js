import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FormGroup from '../FormGroup'

export default class Dial extends PureComponent {
    render() {
        let { label, onChange, value, degree, settings, name } = this.props

        return (
            <FormGroup label={label} classnames="dial">
                <div className="input-dial">
                    <span className="dial" style={{ transform: `rotate(${degree}deg)` }}></span>
                </div>
                <input
                    type="number"
                    name={`${name}-numeric`}
                    id={`${name}-numeric`}
                    value={value}
                    onChange={(e) => onChange(e)}
                    min={settings.min}
                    max={settings.max}
                    step={settings.step}
                />
            </FormGroup>
        )
    }
}

Dial.propType = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
    degree: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
}

Dial.defaultProps = {
    degree: 0
}