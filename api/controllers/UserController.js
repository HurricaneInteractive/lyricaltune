module.exports = {
    registerUser: require('./User/RegisterUser'),
    loginUser: require('./User/LoginUser'),
    getUserByUsername: require('./User/GetUserByUsername'),
    getUserById: require('./User/GetUserById'),
    followUser: require('./User/FollowUser'),
    unfollowUser: require('./User/UnfollowUser'),
    logoutUser: require('./User/LogoutUser'),
    updateUser: require('./User/UpdateUser'),
    getCurrentUser: require('./User/GetCurrentUser')
}