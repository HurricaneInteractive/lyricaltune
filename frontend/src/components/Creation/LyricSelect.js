import React, { Component } from 'react'

import PageTitle from '../Pages/PageTitle'
import PageWrapper from '../Pages/PageWrapper'

import { capitalizeFirst, removeUnderscore } from '../../helpers/typography'

export default class LyricSelect extends Component {
    state = {
        lyrics: ''
    }

    componentDidMount() {
        let that = this;
        this.props.CreateStore.getLyrics()
            .then(res => {
                that.getLyricsDOM(res)
            })
            .catch(e => console.error(e))
    }

    getLyricsDOM(lyrics = this.state.lyrics) {
        let that = this;

        if (lyrics.trim() !== '') {
            lyrics = JSON.stringify(lyrics)
        
            let word_pattern = /(^|<\/?[^>]+>|\s+)([^\s^,<]+)/g
            let wrapped = lyrics.replace(/\\n/g, '<br/> ');
            wrapped = wrapped.replace(/['?"()\\]/g, '');
            
            wrapped = wrapped.replace(word_pattern, function(p1, p2) {
                let i = that.props.CreateStore.selectedWords.indexOf(p1.toLowerCase().trim());
                return `${p2}<span class="${ i !== -1 ? `active no-${i}` : '' }">${p1}</span>`
            })
            
            this.setState({
                lyrics: wrapped
            })
        }
    }

    render() {
        let { CreateStore } = this.props
        return (
            <PageWrapper>
                <PageTitle classnames="lyric-select" title={removeUnderscore(CreateStore.selectedSong)}>
                    <span className="artist c-caption">{capitalizeFirst(CreateStore.selectedArtist)}</span>
                </PageTitle>
                <div className="lyric-select-wrapper">
                    <div className="lyric-wrapper" dangerouslySetInnerHTML={{ __html: this.state.lyrics }} />
                    <div className="lyric-data">
                        <span className="c-caption">Word Selection</span>
                        {
                            CreateStore.selectedWords.length === 0 ? (
                                <h2 className="user-direction highlight">Please Select a Word</h2>
                            ) : (
                                <h5 className="user-direction">Select Another Word - {CreateStore.selectedWords.length}/5</h5>
                            )
                        }
                    </div>
                </div>
            </PageWrapper>
        )
    }
}