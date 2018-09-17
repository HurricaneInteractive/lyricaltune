import React, { PureComponent } from 'react'
import logo from '../../images/lyrical_logo.svg'
import { Link } from 'react-router-dom'

export default class Logo extends PureComponent {
    render() {
        return (
            <h1 className="logo">
                <Link to="/" title="Home">
                    <span className="hide-element">Lyrical</span>
                    <img src={logo} alt="Lyrical Logo" />
                </Link>
            </h1>
        )
    }
}