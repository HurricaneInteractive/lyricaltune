const Success = require('../classes/Success')

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

const LoginFailed = (next) => {
    let error = new Error('Email and Password combination is not vaild')
    error.status = 422
    next(error)
}

const UserCreated = (res, data) => {
    let response = new Success("Your account has successfully been created")
    response.status = 201
    response.dispatch(res, data)
}

const LoginSuccessful = (res, data) => {
    let response = new Success("You have been logged in successfully")
    response.dispatch(res, data)
}

module.exports = {
    returnedError: ReturnedError,
    emailFound: EmailFound,
    usernameFound: UsernameFound,
    loginFailed: LoginFailed,
    userCreated: UserCreated,
    loginSuccessful: LoginSuccessful
}