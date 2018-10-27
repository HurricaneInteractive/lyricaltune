import React, { PureComponent } from 'react'

import ProfileWebsites from './ProfileWebsites'
import profileImage from '../../../images/profile.jpg'

export default class ProfileHeader extends PureComponent {
    render() {
        let { user } = this.props
        return (
            <div className="profile-header">
                <div className="profile-image" style={{ backgroundImage: `url('${profileImage}')` }}></div>
                <h4>{ user.name }</h4>
                <h1>@{ user.username }</h1>
                <ProfileWebsites websites={user.websites} />
            </div>
        )
    }
}