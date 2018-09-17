import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import LoginSignup from './LoginSignup'
import LoggedIn from './LoggedIn'

const menu = [
    {
        to: '/discover',
        name: 'Discover'
    },
    {
        to: '/create',
        name: 'Create'
    }
]

export default class MainMenu extends PureComponent {
    render() {
        return (
            <nav id="main-menu">
                <ul className="menu clearfix">
                    {
                        menu.map((item, key) => (
                            <li key={key}>
                                <Link to={item.to} title={item.name}>{item.name}</Link>
                            </li>
                        ))
                    }
                    {
                        this.props.authenticated ? (
                            <LoggedIn UserStore={this.props.UserStore} />
                        ) : (
                            <LoginSignup UserStore={this.props.UserStore} />
                        )
                    }
                </ul>
            </nav>
        )
    }
}

MainMenu.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    UserStore: PropTypes.any.isRequired
}