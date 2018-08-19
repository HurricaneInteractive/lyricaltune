import React from 'react'
import { Link } from 'react-router-dom'

export default class Header extends React.PureComponent {
    render() {
        return (
            <header>
                Lyrical Tune Nav
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </header>
        )
    }
}