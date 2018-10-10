import React from 'react'

import PageWrapper from '../components/Pages/PageWrapper'
import PageTitle from '../components/Pages/PageTitle'

export default class About extends React.PureComponent {
    render() {
        return (
            <PageWrapper>
                <PageTitle title="About Lyrical" />
                Please don't sue us! We are poor uni students
            </PageWrapper>
        )
    }
}