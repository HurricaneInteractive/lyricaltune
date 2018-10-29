import React, { Component, Fragment } from 'react'

import SinglePhrase from './SinglePhrase'

export default class PhraseCollection extends Component {

    renderAllPhrases = () => {
        let { phrases, UserStore, AudioStore, pushUpdated } = this.props
        let phraseList = phrases.map(phrase => {
            return (
                <Fragment key={phrase._id}>
                    <SinglePhrase
                        phrase={phrase}
                        UserStore={UserStore}
                        AudioStore={AudioStore}
                        pushUpdated={(id, updated) => pushUpdated(id, updated)}
                    />
                    <div className="separator" />
                </Fragment>
            )
        })

        return phraseList
    }

    render() {
        return (
            <div className="phrase-collection">
                { this.renderAllPhrases() }
            </div>
        )
    }
}