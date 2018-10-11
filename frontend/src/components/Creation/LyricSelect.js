import React, { Component } from 'react'
import { X } from 'react-feather'
import { inject, observer } from 'mobx-react';

import PageTitle from '../Pages/PageTitle'
import PageWrapper from '../Pages/PageWrapper'

import { capitalizeFirst, removeUnderscore } from '../../helpers/typography'

@inject('CreateStore')
@observer
export default class LyricSelect extends Component {
    state = {
        lyrics: this.props.CreateStore.lyrics,
        selectedWords: this.props.CreateStore.selectedWords
    }

    componentDidMount() {
        let { CreateStore, routerProps } = this.props
        if (CreateStore.lyrics.trim() === '') {
            this.props.CreateStore.getLyrics()
                .then(res => {
                    if (!res) {
                        routerProps.history.push('/create')
                    }
                })
        }
    }

    getLyricsDOM() {
        let that = this;
        let lyrics = this.props.CreateStore.lyrics

        if (lyrics.trim() !== '') {
            lyrics = JSON.stringify(lyrics)
        
            let word_pattern = /(^|<\/?[^>]+>|\s+)([^\s^,<]+)/g
            let wrapped = lyrics.replace(/\\n/g, '<br/> ');
            wrapped = wrapped.replace(/['?"()\\]/g, '');
            
            wrapped = wrapped.replace(word_pattern, function(p1, p2) {
                let i = that.state.selectedWords.indexOf(p1.toLowerCase().trim());
                return `${p2}<span class="${ i !== -1 ? `active no-${i}` : '' }">${p1}</span>`
            })

            return wrapped
        }
    }

    renderWordPills() {
        let words = this.state.selectedWords;
        if (words.length === 0) {
            return false
        }

        let pills = words.map((word, key) => (
            <li key={key} className={`pill no-${key}`} onClick={() => this.props.CreateStore.removeWord(key)}>
                {word}
                <X />
            </li>
        ))

        return <ul className="selected-words">{pills}</ul>
    }

    render() {
        let { CreateStore } = this.props
        return (
            <PageWrapper>
                <PageTitle classnames="lyric-select" title={removeUnderscore(CreateStore.selectedSong)}>
                    <span className="artist c-caption">{capitalizeFirst(CreateStore.selectedArtist)}</span>
                </PageTitle>
                <div className="lyric-select-wrapper">
                    <div className="lyric-wrapper" dangerouslySetInnerHTML={{ __html: this.getLyricsDOM() }} />
                    <div className="lyric-data">
                        <span className="c-caption">Word Selection</span>
                        {
                            CreateStore.selectedWords.length === 0 ? (
                                <h2 className="user-direction highlight">Please Select a Word</h2>
                            ) : (
                                <h5 className="user-direction">Select Another Word - {CreateStore.selectedWords.length}/5</h5>
                            )
                        }
                        { this.renderWordPills() }
                    </div>
                </div>
            </PageWrapper>
        )
    }
}