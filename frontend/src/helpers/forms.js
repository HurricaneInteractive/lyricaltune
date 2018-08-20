export const validatePassword = (password) => {
    const lenMin = 6
    const lenMax = 100
    const matches = /[\W\d]/gm;
   
    // Length Check
    if (password.length < lenMin || password.length > lenMax) {
        return {
            valid: false,
            message: `Password must between ${lenMin}-${lenMax} characters long`
        }
    }

    if (!matches.exec(password)) {
        return {
            vaild: false,
            message: `Password must include at least one number OR symbol`
        }
    }

    return {
        valid: true
    }
}