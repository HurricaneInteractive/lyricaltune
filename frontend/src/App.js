import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { 
	BrowserRouter as Router, 
	Route
} from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import './App.css';

import Form from './components/Form/Form'

@inject('UserStore')
@observer
class App extends Component {
	constructor() {
		super()
		this.state = {
			username: '',
			number_counter: "0",
			select: ''
		}
	}

	componentDidMount() {
		let token = window.sessionStorage.getItem('auth_token');
		if (token === null || token === '') {
			this.props.UserStore.authenticateUser('abc3@abc.com', 'password');
		}
		else {
			this.props.UserStore.getCurrentUser(token)
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
                type: 'text',
                name: 'username',
				value: this.state.username
			},
			{
                type: 'number',
                name: 'number_counter',
				value: this.state.number_counter,
				attributes: {
					step: 5
				}
			},
			{
				type: 'select',
				name: 'select',
				value: this.state.select,
				options: [
					'adriaan',
					'luke_secomb',
					'tim_andrew_knott'
				]
			}
		]

		return (
			<Router>
				<div className="App">
					<Header />
					<p>Authenticated: { this.props.UserStore.current_user === null ? 'No' : 'Yes' }</p>
					{ this.props.UserStore.current_user !== null ? (<p>Username: {this.props.UserStore.current_user.username}</p>) : ('') }
					
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />

					<Form 
						fields={fields} 
						onChange={(e) => this.onChange(e)}
						onSubmit={() => alert('Form Submitted')}
					>
						<h2>Hello World</h2>
					</Form>
				</div>
			</Router>
		);
	}
}

export default App;
