import React, { Component } from 'react'

import PageTitle from '../Pages/PageTitle'
import PageWrapper from '../Pages/PageWrapper'

import Eminem from '../../data/artists/eminem'
import Panama from '../../data/artists/panama'
import KendrickLamar from '../../data/artists/kendrick_lamar'

const artistList = [Eminem, Panama, KendrickLamar]

export default class ArtistSelect extends Component {

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
                    onMouseEnter={() => this.prefetchLyrics(artist.songKey, artist.artistName)}
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
            <PageWrapper>
                <PageTitle title="Create" />
                { this.renderArtistTiles() }
            </PageWrapper>
        )
    }
}