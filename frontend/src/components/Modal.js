import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Modal extends PureComponent {
    render() {
        return (
            <div className="popup-modal">
                <div className="overlay" onClick={(e) => this.props.close(e)} />
                <div className="modal">
                    <a 
                        href="#close" 
                        className="close-modal"
                        onClick={(e) => this.props.close(e)}
                    >Close</a>
                    { this.props.children }
                </div>
            </div>
        )   
    }
}

Modal.propTypes = {
    close: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
}