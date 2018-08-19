class Success {
    constructor(msg = 'Request has been successfully completed') {
        this._status = 200
        this._msg = msg
    }
    
    set status(s) {
        this._status = s
    }
    
    dispatch(res, data = {}) {
        let json = Object.assign(data, {
            status: this._status,
            message: this._msg,
            error: null
        })

        res.status(this._status).json(json)
    }
}

module.exports = Success