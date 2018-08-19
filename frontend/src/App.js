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

		this.props.UserStore.authenticateUser('abc3@abc.com', 'password');
	}

	render() {
		return (
			<Router>
				<div className="App">
					<Header />
					<p>Authenticated: { this.props.UserStore.current_user === null ? 'No' : 'Yes' }</p>
					<p>Token: {this.props.UserStore.auth_token}</p>
					
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
				</div>
			</Router>
		);
	}
}

export default App;
