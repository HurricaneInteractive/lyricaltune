import React, { Component } from 'react'
import { X } from 'react-feather'
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

import PageTitle from '../Pages/PageTitle'
import PageWrapper from '../Pages/PageWrapper'

import { capitalizeFirst, removeUnderscore } from '../../helpers/typography'

@inject('CreateStore')
@observer
export default class LyricSelect extends Component {
    state = {
        lyrics: this.props.CreateStore.lyrics
    }

    componentDidMount() {
        let { CreateStore, routerProps } = this.props
        if (CreateStore.lyrics.trim() === '') {
            routerProps.history.push('/create')
            // this.props.CreateStore.getLyrics()
            //     .then(res => {
            //         if (!res) {
            //             routerProps.history.push('/create')
            //         }
            //     })
        }

        let lyric_data = document.querySelector(".lyric-select-wrapper .lyric-data")
        let offset = lyric_data.offsetTop
        let rect = lyric_data.getBoundingClientRect()

        window.addEventListener('scroll', () => {
            let windowPos = window.pageYOffset

            if (windowPos + 25 > offset)  {
                lyric_data.classList.add('fixed')
                lyric_data.style.left = rect.left + 'px'
            }
            else {
                lyric_data.classList.remove('fixed')
                lyric_data.style.left = 'initial'
            }
        })

        window.addEventListener('resize', () => {
            offset = lyric_data.offsetTop
            rect = lyric_data.getBoundingClientRect()
        })
    }

    selectLyrics = (word, idx) => {
        let { CreateStore } = this.props
        if (idx !== -1) {
            CreateStore.removeWord(idx)
        }
        else {
            CreateStore.addWord(word)
        }
        CreateStore.generateKey();
    }

    getLyricsDOM() {
        let that = this;
        let lyrics = this.props.CreateStore.lyrics

        if (lyrics.trim() !== '') {
            lyrics = JSON.stringify(lyrics)
        
            let word_pattern = /(^|<\/?[^>]+>|\s+)([^\s^,<]+)/g
            let wrapped = lyrics.replace(/\\n/g, '<br/> ');
            wrapped = wrapped.replace(/['?"()\\]/g, '');

            let split = wrapped.split(word_pattern);
            let dom = split.reduce((prev, current, i) => {
                let match = current.match(word_pattern);
                if (match !== null) {
                    let idx = that.props.CreateStore.words.indexOf(match[0].toLowerCase().trim())
                    return prev.concat(
                        <span
                            className={`${ idx !== -1 ? `active no-${idx}` : '' }`}
                            key={i}
                            onClick={(e) => {
                                e.preventDefault();
                                that.selectLyrics(match[0], idx)
                            }}
                        >{match[0]}</span>
                    )
                }
                else {
                    let br_match = current.match(/<br\/>/g);
                    if (br_match) {
                        let brs = br_match.map((br, key) => <br key={`br-${i}-${key}`}/>)
                        return prev.concat(brs)
                    }
                    else {
                        return prev.concat(current)
                    }
                }
            }, [])

            return <p>{dom}</p>
        }
    }

    renderWordPills() {
        let words = this.props.CreateStore.words;
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
                    <div className="lyric-wrapper">{ this.getLyricsDOM() }</div>
                    <div className="lyric-data">
                        <span className="c-caption">Word Selection</span>
                        {
                            CreateStore.words.length === 0 ? (
                                <h2 className="user-direction highlight">Please Select a Word</h2>
                            ) : (
                                <h5 className="user-direction">Select Another Word - {CreateStore.words.length}/5</h5>
                            )
                        }
                        { this.renderWordPills() }
                        <div className={`lyric-actions ${CreateStore.key !== null ? 'has-key' : ''}`}>
                            {
                                CreateStore.words.length > 0 && CreateStore.key !== null ? (
                                    <div className="generated-key">
                                        <span className="c-caption">Creation Key</span>
                                        <h3>{ CreateStore.key }</h3>
                                    </div>
                                ) : ('')
                            }
                            <Link className="cancel" to="/create">Cancel</Link>
                        </div>
                        {
                            CreateStore.key !== null ? (
                                <Link to="/create/mixlab" className="btn mixlab-cta">Start mixing</Link>
                            ) : ('')
                        }
                    </div>
                </div>
            </PageWrapper>
        )
    }
}