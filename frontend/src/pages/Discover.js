import React, { Component } from 'react'

import PageWrapper from '../components/Pages/PageWrapper'
import PageTitle from '../components/Pages/PageTitle'

import SearchForm from '../components/WebForms/Search'

export default class Discover extends Component {
    render() {
        return (
            <PageWrapper>
                <PageTitle title="Discover">
                    <SearchForm />
                </PageTitle>
            </PageWrapper>
        )
    }
}