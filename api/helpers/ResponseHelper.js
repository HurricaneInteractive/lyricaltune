const ReturnedError = (res, err) => {
    res.status(500).json({
        error: err
    })
}

const EmailFound = (next) => {
    let error = new Error('Email Address is already in use')
    error.status = 409
    next(error)
}

const UsernameFound = (next) => {
    let error = new Error('Username is already in use')
    error.status = 409
    next(error)
}

module.exports = {
    returnedError: ReturnedError,
    emailFound: EmailFound,
    usernameFound: UsernameFound
}