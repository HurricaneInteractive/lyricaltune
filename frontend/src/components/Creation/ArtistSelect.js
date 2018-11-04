import React, { Component, Fragment } from 'react'

import PageTitle from '../Pages/PageTitle'
import PageWrapper from '../Pages/PageWrapper'
// import Search from '../WebForms/Search'
import Loading from '../Loading'
import { performAxiosCall } from '../../helpers/api'

import Eminem from '../../data/artists/eminem'
import Panama from '../../data/artists/panama'
import KendrickLamar from '../../data/artists/kendrick_lamar'
import axios from 'axios';

const artistList = [Eminem, Panama, KendrickLamar]

export default class ArtistSelect extends Component {

    base_url = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/'

    state = {
        results: null,
        results_lyrics: null
    }

    componentDidMount() {
        let results = window.sessionStorage.getItem('results')
        let results_lyrics = window.sessionStorage.getItem('results_lyrics')

        if (results === null || results_lyrics === null) {
            this.fetchLyrics()
        }
        else {
            this.setState({
                results: JSON.parse(results),
                results_lyrics: JSON.parse(results_lyrics)
            })
        }
    }

    fetchLyrics = () => {
        let url = `${this.base_url}chart.tracks.get?page_size=20&f_has_lyrics=1&apikey=66ccca8900016be9e55889bfe1566261`
        axios.get(url)
            .then(res => {
                let tracks = res.data.message.body.track_list
                window.sessionStorage.setItem('results', JSON.stringify(tracks))
                this.setState({
                    results: tracks
                })

                let get_lyric_urls = tracks.map(({track}) => {
                    return axios.get(`${this.base_url}track.lyrics.get?track_id=${track.track_id}&apikey=66ccca8900016be9e55889bfe1566261`)
                })

                return get_lyric_urls
            })
            .then(promises => {
                Promise.all(promises).then(lyrics => {
                    // console.log('Lyrics', lyrics)
                    let allLyrics = lyrics.map(({data}) => data.message.body.lyrics)
                    window.sessionStorage.setItem('results_lyrics', JSON.stringify(allLyrics))
                    this.setState({
                        results_lyrics: allLyrics
                    })
                })
                .catch(e => console.error(e))
            })
            .catch(e => console.error(e))
    }

    prefetchLyrics = (key, artist) => {
        const _that = this
        this.props.CreateStore.getLyrics(key)
            .then(res => {
                _that.props.CreateStore.setArtistName(artist)
            })
            .catch(e => console.error(e))
    }

    renderArtistTiles = () => {
        let tiles = artistList.map((artist) => {
            return (
                <div 
                    className="tile"
                    key={artist.songKey}
                    style={{
                        backgroundImage: `url(${artist.coverImage})`
                    }}
                    onMouseOver={() => this.prefetchLyrics(artist.songKey, artist.artistName)}
                    onClick={(e) => {
                        e.preventDefault();
                        this.props.routerProps.history.push('/create/lyrics')
                    }}
                >
                    <p className="h2">{artist.artistName}</p>
                </div>
            )
        })

        return <div className="artist-tiles">{tiles}</div>
    }

    setLyrics = (e, lyrics, artist, song) => {
        e.preventDefault();
        let body = lyrics.lyrics_body

        body = body.replace(/\(\d+\)/gmi, '')
        body = body.replace(/(\*\*\*\*\*\*\* This Lyrics is NOT for Commercial use \*\*\*\*\*\*\*)/gm, '')

        this.props.CreateStore.setLyricsWithMetadata(body.trim(), artist, song)
        this.props.routerProps.history.push('/create/lyrics')
    }

    renderChartResults = () => {
        let { results, results_lyrics } = this.state
        let available_tracks = results.map(({track}, key) => {
            let lyrics = null
            let { artist_name, track_id, track_name } = track
            if ( results_lyrics !== null ) {
                lyrics = typeof results_lyrics[key] !== 'undefined' ? results_lyrics[key] : null
            }

            return (
                <Fragment key={track_id}>
                    <div className="track">
                        <div className="content">
                            { track_name ? <h3>{track_name}</h3> : '' }
                            { artist_name ? <p className="text--uppercase">{artist_name}</p> : '' }
                        </div>
                        <div className="actions">
                            { lyrics ? (
                                <a href="#select" className="btn btn-highlight" onClick={(e) => this.setLyrics(e, lyrics, artist_name, track_name)}>
                                    <div className="hide-text">Select</div>
                                </a>
                            ) : <Loading /> }
                        </div>
                    </div>
                    <div className="separator" />
                </Fragment>
            )
        })

        return <div className="available-tracks">{available_tracks}</div>
    }

    render() {
        return (
            <PageWrapper classnames={'artist-select'}>
                <PageTitle title="Song Select" />
                {/* <Search /> */}
                { this.state.results ? this.renderChartResults() : <Loading /> }
            </PageWrapper>
        )
    }
}