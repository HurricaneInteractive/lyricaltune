import React, { PureComponent, Fragment } from 'react'
import { performAxiosCall } from '../helpers/api'

import PageWrapper from '../components/Pages/PageWrapper'
import ProfileHeader from '../components/Pages/Profile/ProfileHeader'

import Loading from '../components/Loading'

export default class Profile extends PureComponent {
    state = {
        user: null
    }

    componentDidMount() {
        let { routerProps } = this.props
        let id = routerProps.match.params.id

        performAxiosCall(`/users/id/${id}`)
            .then(res => {
                this.setState({
                    user: res.data.user_profile
                })
            })
            .catch(e => console.error(e))
    }

    render() {
        let { user } = this.state
        console.log(user);

        return (
            <PageWrapper>
                {
                    user ? (
                        <Fragment>
                            <ProfileHeader user={user} />
                        </Fragment>
                    ) : (
                        <Loading />
                    )
                }
            </PageWrapper>
        )
    }
}