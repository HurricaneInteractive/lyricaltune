import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LoginSignup from './Navigation/LoginSignup'
import LoggedIn from './Navigation/LoggedIn'
import MenuItem from './Navigation/MenuItem'
import { footerMenu } from '../helpers/config-menus'
import SocialMedia from './Branding/SocialMedia'

export default class Footer extends PureComponent {
    render() {
        return (
            <footer>
                <div className="container">
                    <div className="col menu-container">
                        <div className="user-menu">
                            <ul>
                            {
                                this.props.authenticated ? (
                                    <LoggedIn UserStore={this.props.UserStore} />
                                ) : (
                                    <LoginSignup UserStore={this.props.UserStore} GlobalStore={this.props.GlobalStore} />
                                )
                            }
                            </ul>
                            <SocialMedia />
                        </div>
                        <div className="main-menu">
                            <ul>
                                { footerMenu.map((item, key) => <MenuItem key={key} to={item.to} name={item.name} />) }
                            </ul>
                        </div>
                    </div>
                    <div className="col credit text--right">
                        <p>Built by <a href="https://sunset-studios.netlify.com/" target="_blank" rel="noopener noreferrer">Sunset Studios</a></p>
                    </div>
                </div>
            </footer>
        )
    }
}

Footer.propTypes = {
    authenticated: PropTypes.bool,
    UserStore: PropTypes.any.isRequired,
    GlobalStore: PropTypes.any.isRequired
}

Footer.defaultProps = {
    authenticated: false
}