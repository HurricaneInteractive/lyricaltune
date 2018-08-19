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

@inject('UserStore')
@observer
class App extends Component {
	componentDidMount() {
		// fetch('/users')
		// 	.then(res => res.json())
		// 	.then(j => console.log(j))
		// 	.catch(e => console.error(e))

		// this.props.UserStore.getUserData('TheQuirkyTurtle')
		let token = window.sessionStorage.getItem('auth_token');
		if (token === null || token === '') {
			this.props.UserStore.authenticateUser('abc3@abc.com', 'password');
		}
		else {
			this.props.UserStore.getCurrentUser(token)
		}
	}

	render() {
		return (
			<Router>
				<div className="App">
					<Header />
					<p>Authenticated: { this.props.UserStore.current_user === null ? 'No' : 'Yes' }</p>
					{ this.props.UserStore.current_user !== null ? (<p>Username: {this.props.UserStore.current_user.username}</p>) : ('') }
					
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
				</div>
			</Router>
		);
	}
}

export default App;
