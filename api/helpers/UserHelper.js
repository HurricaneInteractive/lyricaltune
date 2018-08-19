/**
 * Helper for methods that need to be performed on a User document
 */
class UserHelper {
    /**
     * Return the user document without a password
     *
     * @returns User
     * @memberof UserHelper
     */
    prepareResponse() {
        let protected_keys = ['password'];
        let user = this.toJSON();
        
        protected_keys.forEach(key => {
            delete user[key]
        })
        
        return user
    }
}

module.exports = UserHelper