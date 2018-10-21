import React, { Component } from 'react'

import PageWrapper from '../components/Pages/PageWrapper'
import PageTitle from '../components/Pages/PageTitle'

import SearchForm from '../components/WebForms/Search'

import { performAxiosCall } from '../helpers/api'

import PhraseCollection from '../components/Phrases/PhraseCollection'

export default class Discover extends Component {
    state = {
        phrases: null
    }

    componentDidMount() {
        performAxiosCall('/phrases/')
            .then(phrases => {
                this.setState({
                    phrases: phrases.data.phrases
                })
            })
            .catch(e => console.error(e))
    }

    render() {
        let { phrases } = this.state
        let { UserStore, AudioStore } = this.props

        return (
            <PageWrapper>
                <PageTitle title="Discover">
                    <SearchForm />
                </PageTitle>
                <div className="page-content">
                    { phrases ? <PhraseCollection UserStore={UserStore} AudioStore={AudioStore} phrases={phrases} /> : 'Loading...' }
                </div>
            </PageWrapper>
        )
    }
}