import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class PageWrapper extends PureComponent {
    render() {
        return (
            <main className={`page-wrapper ${this.props.classnames}`}>
                <div className="container">
                    {this.props.children}
                </div>
            </main>
        )
    }
}

PageWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    classnames: PropTypes.string
}

PageWrapper.defaultProps = {
    classnames: ''
}