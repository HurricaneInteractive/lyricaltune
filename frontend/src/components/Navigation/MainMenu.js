import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LoginSignup from './LoginSignup'
import LoggedIn from './LoggedIn'
import { headerMenu } from '../../helpers/config-menus'
import MenuItem from './MenuItem'

export default class MainMenu extends PureComponent {
    render() {
        return (
            <nav id="main-menu">
                <ul className="menu clearfix">
                    { headerMenu.map((item, key) => <MenuItem key={key} to={item.to} name={item.name} />) }
                    {
                        this.props.authenticated ? (
                            <LoggedIn UserStore={this.props.UserStore} />
                        ) : (
                            <LoginSignup UserStore={this.props.UserStore} GlobalStore={this.props.GlobalStore} />
                        )
                    }
                </ul>
            </nav>
        )
    }
}

MainMenu.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    UserStore: PropTypes.any.isRequired,
    GlobalStore: PropTypes.any.isRequired
}