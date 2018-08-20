import React from 'react'

import { removeUnderscore } from '../../helpers/typography'

const FormGroup = (props) => (
    <div className="input-group">
        <label htmlFor={props.label}>{removeUnderscore(props.label)}</label>
        {props.children}
    </div>
)

export default FormGroup