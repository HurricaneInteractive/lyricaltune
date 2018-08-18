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
        let user = this.toObject();
        delete user.password
        return user
    }
}

module.exports = UserHelper