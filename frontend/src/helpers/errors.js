export const errorClass = (status = 500) => {
    console.log(status)
    if (status >= 300 && status < 400) {
        return 'info'
    }
    else if (status >= 400 && status < 500) {
        return 'warning'
    }
    else {
        return 'error'
    }
}