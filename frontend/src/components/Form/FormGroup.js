import React from 'react'

import { removeUnderscore } from '../../helpers/typography'

const FormGroup = (props) => (
    <div className={`input-group ${ props.classnames ? props.classnames : '' }`}>
        <label htmlFor={props.label}>{removeUnderscore(props.label)}</label>
        {props.children}
        { props.help ? <p className="form-group-help">{props.help}</p> : '' }
    </div>
)

export default FormGroup