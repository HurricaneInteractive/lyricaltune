const Success = require('../classes/Success')

const ReturnedError = (res, err) => {
    console.log(err)
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

const UserCreated = (res, data = {}) => {
    let response = new Success("Your account has successfully been created")
    response.status = 201
    response.dispatch(res, data)
}

const LoginSuccessful = (res, data = {}) => {
    let response = new Success("You have been logged in successfully")
    response.dispatch(res, data)
}

const NoUserWithUsername = (username, next) => {
    let error = new Error(`There doesn\'t appear to be a user with the username \'${username}\'`)
    error.status = 404
    next(error)
}

const NoUserWithId = (id, next) => {
    let error = new Error(`There doesn\'t appear to be a user with the id \'${id}\'`)
    error.status = 404
    next(error)
}

const UserFound = (res, data = {}) => {
    let response = new Success()
    response.dispatch(res, data)
}

const AlreadyFollowingUser = (next) => {
    let error = new Error('You are already following this user')
    error.status = 422
    next(error)
}

const NotFollowingUser = (next) => {
    let error = new Error('You are not currently following this user')
    error.status = 422
    next(error)
}

const FollowingFailed = (next) => {
    let error = new Error('Following request could not be processed, please try again')
    error.status = 422
    next(error)
}

const TryingToFollowCurrentUser = (next) => {
    let error = new Error('You are not able to follow your own account')
    error.status = 422
    next(error)
}

const FollowingSucceed = (res, data = {}) => {
    let response = new Success('You have successfully followed the user')
    response.dispatch(res, data)
}

const UnfollowSucceed = (res, data = {}) => {
    let response = new Success('You have successfully unfollowed the user')
    response.dispatch(res, data)
}

const LogoutSuccess = (res, data = {}) => {
    let response = new Success('Account successfully logged out')
    response.dispatch(res, data)
}

const UpdateUserSuccessful = (res, data = {}) => {
    let response = new Success('Account has been successfully updated')
    response.dispatch(res, data)
}

const PhraseSavedSuccessfully = (res, name, data = {}) => {
    let response = new Success(`${name} has succesfully been created`)
    response.status = 201
    response.dispatch(res, data)
}

const UserPhrasesSuccess = (res, data = {}) => {
    let response = new Success('User phrases successfully found')
    response.dispatch(res, data)
}

const RequestingDifferentUserPhrases = (next) => {
    let error = new Error('You are not able to access different users phrases')
    error.status = 400
    next(error)
}

const PhraseDeletedSuccessfully = (res, data = {}) => {
    let response = new Success('Requested phrase was successfully deleted')
    response.dispatch(res, data)
}

const PhraseNotFound = (next) => {
    let error = new Error('Phrase does not exist')
    error.status = 422
    next(error)
}

const PhraseFound = (res, data = {}) => {
    let response = new Success('Phrase was successfully found')
    response.dispatch(res, data)
}

const PhraseUpdateSuccess = (res, data = {}) => {
    let response = new Success('Phrase was successfully updated')
    response.dispatch(res, data)
}

const PhraseLikeCompleted = (res, data = {}) => {
    let response = new Success('Phrase like has been completed')
    response.dispatch(res, data)
}

const BeatCreated = (res, data = {}) => {
    let response = new Success('Beat was successfully created')
    response.status = 201
    response.dispatch(res, data)
}

const RequestingDifferentUserBeats = (next) => {
    let error = new Error('You are not able to access different users beats')
    error.status = 400
    next(error)
}
const BeatNotFound = (next) => {
    let error = new Error('Beat does not exist')
    error.status = 422
    next(error)
}

const BeatFound = (res, data = {}) => {
    let response = new Success('Beat was successfully found')
    response.dispatch(res, data)
}

const BeatDeletedSuccessfully = (res, data = {}) => {
    let response = new Success('Requested beat was successfully deleted')
    response.dispatch(res, data)
}

const UserBeatsSuccess = (res, data = {}) => {
    let response = new Success('User beats successfully found')
    response.dispatch(res, data)
}

const BeatUpdateSuccess = (res, data = {}) => {
    let response = new Success('Beat was successfully updated')
    response.dispatch(res, data)
}

const FoundPhrases = (res, data = {}) => {
    let response = new Success('Fetched phrases')
    response.dispatch(res, data)
}

module.exports = {
    returnedError: ReturnedError,
    emailFound: EmailFound,
    usernameFound: UsernameFound,
    loginFailed: LoginFailed,
    userCreated: UserCreated,
    loginSuccessful: LoginSuccessful,
    noUserWithUsername: NoUserWithUsername,
    noUserWithId: NoUserWithId,
    userFound: UserFound,
    alreadyFollowingUser: AlreadyFollowingUser,
    followingFailed: FollowingFailed,
    followingSucceed: FollowingSucceed,
    tryingToFollowCurrentUser: TryingToFollowCurrentUser,
    unfollowSucceed: UnfollowSucceed,
    notFollowingUser: NotFollowingUser,
    logoutSuccess: LogoutSuccess,
    updateUserSuccessful: UpdateUserSuccessful,
    phraseSavedSuccessfully: PhraseSavedSuccessfully,
    userPhrasesSuccess: UserPhrasesSuccess,
    requestingDifferentUserPhrases: RequestingDifferentUserPhrases,
    phraseDeletedSuccessfully: PhraseDeletedSuccessfully,
    phraseNotFound: PhraseNotFound,
    phraseFound: PhraseFound,
    phraseUpdateSuccess: PhraseUpdateSuccess,
    beatCreated: BeatCreated,
    requestingDifferentUserBeats: RequestingDifferentUserBeats,
    beatNotFound: BeatNotFound,
    beatFound: BeatFound,
    beatDeletedSuccessfully: BeatDeletedSuccessfully,
    userBeatsSuccess: UserBeatsSuccess,
    beatUpdateSuccess: BeatUpdateSuccess,
    phraseLikeCompleted: PhraseLikeCompleted,
    foundPhrases: FoundPhrases
}