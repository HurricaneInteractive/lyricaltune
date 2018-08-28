import React from 'react'
import { errorClass } from '../helpers/errors'

const ErrorPopup = ({ errors, dismiss }) => {
    let message = 'We are experiencing some difficulties, please check your information and try again.',
        status = 500,
        errorclass = typeof errors.status !== 'undefined' && errors.status !== null ? errorClass(errors.status) : errorClass(status)

    if (typeof errors.message !== 'undefined' || errors !== null) {
        if (typeof errors.kind !== 'undefined') {
            if (errors.kind === 'ObjectId') {
                message = 'Invalid arguements provided, pleace check your information and try again.'
            }
        }
        else {
            message = errors.message
        }
    }

    return (
        <div className={`error-popup ${errorclass}`}>
            <p>{ message }</p>
            <button onClick={(e) => { e.preventDefault(); dismiss() }}>Dismiss</button>
        </div>
    )
}

export default ErrorPopup