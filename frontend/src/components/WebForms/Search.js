import React, { Component } from 'react'

import Form from '../Form/Form'
import { Search } from 'react-feather'

export default class SearchForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'all',
            search: ''
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const fields = [
            {
                type: 'select',
                name: 'type',
                value: this.state.type,
                options: ['all', 'user', 'phrase', 'phrase_user', 'by_song', 'by_artist']
            },
            {
                type: 'text',
                name: 'search',
                value: this.state.search,
                attributes: {
                    placeholder: 'Search...',
                    autocomplete: 'off'
                }
            }
        ]
        return (
            <div className="search-form">
                <Form
                    fields={fields}
                    onChange={(e) => this.onChange(e)}
                    onSubmit={() => alert('search')}
                    submitButtonText={<Search />}
                />
            </div>
        )
    }
}