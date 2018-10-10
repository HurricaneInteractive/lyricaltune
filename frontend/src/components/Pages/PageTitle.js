import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class PageTitle extends PureComponent {
    render() {
        return (
            <div className={`page-title ${this.props.classnames}`}>
                <h1>{this.props.title}</h1>
                { this.props.children }
            </div>
        )
    }
}

PageTitle.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    classnames: PropTypes.string
}

PageTitle.defaultProps = {
    classnames: ''
}