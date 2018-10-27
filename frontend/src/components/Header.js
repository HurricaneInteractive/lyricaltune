import React from 'react'
import PropTypes from 'prop-types'
import Logo from './Branding/Logo'
import MainMenu from './Navigation/MainMenu'

export default class Header extends React.PureComponent {
    render() {
        return (
            <header className={ this.props.routerProps.match.isExact && this.props.routerProps.match.path === '/' ? 'home' : '' }>
                <div className="container">
                    <Logo />
                    <MainMenu
                        authenticated={this.props.authenticated}
                        UserStore={this.props.UserStore}
                        GlobalStore={this.props.GlobalStore}
                    />
                </div>
            </header>
        )
    }
}

Header.propTypes = {
    authenticated: PropTypes.bool,
    UserStore: PropTypes.any.isRequired,
    GlobalStore: PropTypes.any.isRequired
}

Header.defaultProps = {
    authenticated: false
}