import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Play, Pause } from 'react-feather'
import { Link } from 'react-router-dom'

import Lit from './Lit'

import { performAxiosCall } from '../../helpers/api'

@inject('AudioStore')
@observer
export default class SinglePhrase extends Component {

    likePhrase = (e, id) => {
        e.preventDefault();
        console.log('Like', id);
        let { UserStore } = this.props
        let headers = UserStore.axiosHeaders

        performAxiosCall(`/phrases/like`, { id: id }, 'post', headers, true, UserStore.globalstore)
            .then(({data}) => {
                // console.log(res)
                if (data.error === null) {
                    this.props.pushUpdated(id, data.updated)
                }
            })
            .catch(e => console.error(e))
    }

    followUser = (e, id) => {
        e.preventDefault();
        console.log('Follow', id);
    }

    playPhrase = (e, phrase) => {
        e.preventDefault()

        let { AudioStore } = this.props
        if (AudioStore.isPlaying) {
            AudioStore.stopTransportLoop()
        }
        AudioStore.setPlayingPhraseId(phrase._id)
        AudioStore.transportLoop(phrase.phrases, phrase.effects, false)
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
        let { phrase, AudioStore } = this.props

        return (
            <div className="single-phrase">
                <div className="play">
                    <a href="#start" onClick={(e) => this.playPhrase(e, phrase)}>
                        { AudioStore.playingPhrase === phrase._id ? <Pause /> : <Play /> }
                    </a>
                </div>
                <h3>{phrase.name}</h3>
                { this.renderMeta() }
                { this.renderActions() }
            </div>
        )
    }
}