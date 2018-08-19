const LogoutSuccess = require('../../helpers/ResponseHelper').logoutSuccess

module.exports = (req, res, next) => {
    LogoutSuccess(res, {
        token: null,
        current_user: null
    })
}