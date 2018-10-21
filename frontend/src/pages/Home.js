import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import create from '../images/create-bg.jpg'
import discover from '../images/discover-bg.jpg'

export default class Home extends Component {
    render() {
        return (
            <div className="homepage-wrapper">
                <Link to="/create" style={{ backgroundImage: `url('${create}')` }}>
                    <h2>Create</h2>
                </Link>
                <Link to="/discover" style={{ backgroundImage: `url('${discover}')` }}>
                    <h2>Discover</h2>
                </Link>
            </div>
        )
    }
}