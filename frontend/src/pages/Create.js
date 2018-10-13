import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { inject, observer } from 'mobx-react';

import ArtistSelect from '../components/Creation/ArtistSelect'
import LyricSelect from '../components/Creation/LyricSelect'
import Mixlab from '../components/Creation/Mixlab'

@inject('CreateStore')
@observer
export default class Create extends Component {
    render() {
        let { UserStore, routerProps, CreateStore, AudioStore } = this.props

        return (
            <Fragment>
                <Route exact path={`${routerProps.match.url}`} render={(routerProps) => (
                    <ArtistSelect
                        CreateStore={CreateStore}
                        routerProps={routerProps}
                    />
                )} />
                <Route path={`${routerProps.match.url}/lyrics`} render={(routerProps) => (
                    <LyricSelect
                        CreateStore={CreateStore}
                        routerProps={routerProps}
                    />
                )} />
                <Route path={`${routerProps.match.url}/mixlab`} render={(routerProps) => (
                    <Mixlab
                        CreateStore={CreateStore}
                        routerProps={routerProps}
                        UserStore={UserStore}
                        authenticated={this.props.authenticated}
                        AudioStore={AudioStore}
                    />
                )} />
            </Fragment>
        )
    }
}

Create.propTypes = {
    authenticated: PropTypes.bool,
    UserStore: PropTypes.any.isRequired,
    routerProps: PropTypes.any.isRequired
}

Create.defaultProps = {
    authenticated: false
}