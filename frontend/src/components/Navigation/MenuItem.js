import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const MenuItem = (props) => {
    return (
        <li>
            {
                props.external ? (
                    <a href={props.to} target="_blank" rel="noopener noreferrer" title={props.name}>{props.name}</a>
                ) : (
                    <Link to={props.to} title={props.name}>{props.name}</Link>
                )
            }
        </li>
    )
}

MenuItem.propTypes = {
    to: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    external: PropTypes.bool
}

MenuItem.defaultProps = {
    external: false
}

export default MenuItem