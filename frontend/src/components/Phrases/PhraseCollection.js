import React, { PureComponent, Fragment } from 'react'

import SinglePhrase from './SinglePhrase'

export default class PhraseCollection extends PureComponent {

    renderAllPhrases = () => {
        let { phrases, UserStore, AudioStore } = this.props
        let phraseList = phrases.map(phrase => {
            return (
                <Fragment key={phrase._id}>
                    <SinglePhrase
                        phrase={phrase}
                        UserStore={UserStore}
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