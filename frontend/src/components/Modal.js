import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { X } from 'react-feather'

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
                    ><X stroke={'#182637'} /><span className="hide-text">Close</span></a>
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