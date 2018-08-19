const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')
const SignUserToken = require('./GenerateJWT').signUserToken

module.exports = (req, res, next) => {
    // Checks if the provided URLs are valid
    Object.keys(req.body.websites).forEach(key => {
        let re = new RegExp('^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$', 'i')
        if (re.exec(req.body.websites[key]) === null) {
            let error = {
                message: `\"${req.body.websites[key]}\" is not a vaild URL`,
                status: 406
            }
            ResponseHelper.returnedError(res, error)
        }
    })
    
    let current_user = req.jwt_user,
        name = req.body.name || current_user.name,
        websites = typeof req.body.websites !== 'undefined' && req.body.websites !== null ? Object.assign({}, current_user.websites, req.body.websites) : current_user.websites

    // Finds the current user and updates its name and websites
    User.findOneAndUpdate({_id: current_user._id}, {
        $set: {
            name: name,
            websites: websites
        }
    }, { new: true}).exec().then(response => response.prepareResponse())
    .then(doc => {
        // Sign a new JWT Token
        SignUserToken(doc, (error, token) => {
            if (error) {
                ResponseHelper.returnedError(res, error)
            }
            else {
                // Returns the data
                ResponseHelper.updateUserSuccessful(res, {
                    token: token,
                    current_user: doc
                })
            }
        })
    })
    .catch(err => {
        ResponseHelper.returnedError(res, err)
    })
}