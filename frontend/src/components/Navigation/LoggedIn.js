import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class LoggedIn extends PureComponent {

    logout = e => {
        e.preventDefault();
        window.sessionStorage.removeItem('auth_token')
        window.location = '/'
    }

    render() {
        const { UserStore } = this.props
        return (
            <Fragment>
                <li>
                    <Link to={`/profile/${UserStore.current_user._id}`}>{UserStore.current_user.username}</Link>
                    <ul>
                        <li>
                            <a href="#logout" title="logout" onClick={(e) => this.logout(e)}>Logout</a>
                        </li>
                    </ul>
                </li>
            </Fragment>
        )
    }
}

LoggedIn.propTypes = {
    UserStore: PropTypes.any.isRequired
}