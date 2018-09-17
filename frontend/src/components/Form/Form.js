import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from './InputTypes/Input'
import NumberInput from './InputTypes/Number'
import SelectBox from './InputTypes/SelectBox'

export default class Form extends Component {
    constructor() {
        super()
        this.renderFormContents = this.renderFormContents.bind(this)
    }

    renderFormContents(fields) {
        const fieldTypes = {
            text: Input,
            password: Input,
            number: NumberInput,
            select: SelectBox
        }

        return fields.map((field, i) => {
            const InputType = fieldTypes[field.type]
            return (
                <InputType
                    key={i}
                    onChange={(e) => this.props.onChange(e)}
                    {...field}
                />
            )
        })
    }

    render() {
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    this.props.onSubmit()
                }}
            >
                { this.props.children }
                { this.renderFormContents(this.props.fields) }
                <div className="form-actions">
                    <button type="submit" className="btn">{this.props.submitButtonText}</button>
                </div>
            </form>
        )
    }
}

Form.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitButtonText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ])
}

Form.defaultProps = {
    submitButtonText: 'Submit'
}