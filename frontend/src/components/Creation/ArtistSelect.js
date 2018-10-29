import React, { Component } from 'react'

import PageTitle from '../Pages/PageTitle'
import PageWrapper from '../Pages/PageWrapper'
import Search from '../WebForms/Search'

import Eminem from '../../data/artists/eminem'
import Panama from '../../data/artists/panama'
import KendrickLamar from '../../data/artists/kendrick_lamar'

const artistList = [Eminem, Panama, KendrickLamar]

export default class ArtistSelect extends Component {

    state = {
        results: null
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

    render() {
        return (
            <PageWrapper classnames={'artist-select'}>
                <PageTitle title="Create" />
                <Search />
                { this.state.results ? this.renderArtistTiles() : '' }
            </PageWrapper>
        )
    }
}