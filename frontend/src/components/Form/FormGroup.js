import React from 'react'

const FormGroup = (props) => (
    <div className="input-group">
        <label htmlFor={props.label}>{props.label}</label>
        {props.children}
    </div>
)

export default FormGroup