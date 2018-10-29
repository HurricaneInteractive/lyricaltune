import React, { Component, Fragment } from 'react'

import PageWrapper from '../components/Pages/PageWrapper'
import PageTitle from '../components/Pages/PageTitle'

import { performAxiosCall } from '../helpers/api'

import PhraseCollection from '../components/Phrases/PhraseCollection'
import Loading from '../components/Loading'

export default class Discover extends Component {
    state = {
        phrases: [],
        next: 0,
        count: 99999999,
        fetching: false
    }

    componentDidMount() {
        this.loadMore()
    }

    loadMore = (e = null) => {
        if (e) e.preventDefault();

        this.setState({
            fetching: true
        })

        performAxiosCall(`/phrases?limit=${5}&offset=${this.state.next}`)
            .then(phrases => {
                let curPhrases = this.state.phrases;
                curPhrases.push(...phrases.data.phrases)
                this.setState({
                    phrases: curPhrases,
                    next: phrases.data.next,
                    count: phrases.data.count,
                    fetching: false
                })
            })
            .catch(e => console.error(e))
    }

    pushUpdated = (id, updated) => {
        let { phrases } = this.state,
            index = phrases.findIndex(item => item._id === id)

        phrases[index] = updated
        this.setState({
            phrases: phrases
        })
    }

    render() {
        let { phrases, count, fetching } = this.state
        let { UserStore, AudioStore } = this.props

        return (
            <PageWrapper>
                <PageTitle title="Discover" />
                <div className="page-content">
                    { 
                        phrases.length > 0 ? (
                            <Fragment>
                                <PhraseCollection UserStore={UserStore} AudioStore={AudioStore} phrases={phrases} pushUpdated={(id, updated) => this.pushUpdated(id, updated)} />
                                {
                                    phrases.length < count ? (
                                        <div className="load-more">
                                            <a href="#loadmore" className="btn btn-highlight" onClick={ (e) => this.loadMore(e) }>
                                                { fetching ? <Loading /> : 'Load more' }
                                            </a>
                                        </div>
                                    ) : (
                                        ''
                                    )
                                }
                            </Fragment>
                        ) : (
                            <Loading /> 
                        )
                    }
                </div>
            </PageWrapper>
        )
    }
}