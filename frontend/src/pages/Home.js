import React, { Component } from 'react'

import PageWrapper from '../components/Pages/PageWrapper'
import PageTitle from '../components/Pages/PageTitle'

export default class Home extends Component {
    render() {
        return (
            <PageWrapper>
                <PageTitle title="Homepage"></PageTitle>
            </PageWrapper>
        )
    }
}