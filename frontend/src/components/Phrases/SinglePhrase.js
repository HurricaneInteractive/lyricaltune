import React, { PureComponent } from 'react'
import { Play, Pause } from 'react-feather'
import { Link } from 'react-router-dom'

import Lit from './Lit'

export default class SinglePhrase extends PureComponent {

    likePhrase = (e, id) => {
        e.preventDefault();
        console.log('Like', id);
    }

    followUser = (e, id) => {
        e.preventDefault();
        console.log('Follow', id);
    }

    renderMeta = () => {
        let { UserStore, phrase } = this.props
        let usersPhrase = UserStore.current_user ? UserStore.current_user._id === phrase.author : false

        return (
            <div className="meta">
                <Link to={`/profile/${phrase.author}`} className="username">{phrase.author_username}</Link>
                {
                    !usersPhrase && UserStore.current_user ? (
                        <a
                            href="#follow"
                            className="btn"
                            onClick={(e) => this.followUser(e, phrase.author)}
                        >Follow</a>
                    ) : (
                        ''
                    )
                }
            </div>
        )
    }

    checkIfLikes = (likes, user_id) => {
        let i = likes.indexOf(user_id);
        return i === -1 ? false : true
    }

    renderActions = () => {
        let { UserStore, phrase } = this.props

        return (
            <div className="actions">
                <a href="#like" onClick={(e) => this.likePhrase(e, phrase._id)}>
                    <Lit stroke={ UserStore.current_user && this.checkIfLikes(phrase.meta.users_who_liked, UserStore.current_user._id) ? '#ED1965' : '#fff' } />
                    <span className="hide-text">Like Phrase</span>
                </a>
                <span className="count">{phrase.meta.likes}</span>
            </div>
        )
    }

    render() {
        let { phrase } = this.props

        return (
            <div className="single-phrase">
                <div className="play">
                    <Play />
                </div>
                <h3>{phrase.name}</h3>
                { this.renderMeta() }
                { this.renderActions() }
            </div>
        )
    }
}