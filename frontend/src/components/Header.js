import React from 'react'
import PropTypes from 'prop-types'
import Logo from './Branding/Logo'
import MainMenu from './Navigation/MainMenu'

export default class Header extends React.PureComponent {
    render() {
        return (
            <header>
                <div className="container">
                    <Logo />
                    <MainMenu
                        authenticated={this.props.authenticated}
                        UserStore={this.props.UserStore}
                    />
                </div>
            </header>
        )
    }
}

Header.propTypes = {
    authenticated: PropTypes.bool,
    UserStore: PropTypes.any.isRequired
}

Header.defaultProps = {
    authenticated: false
}