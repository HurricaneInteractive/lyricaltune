import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { 
	BrowserRouter as Router, 
	Route
} from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import SecondChanceAuth from './components/Auth/SecondChanceAuth'

import './App.css';

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

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		const { UserStore } = this.props;
		return (
			<Router>
				<div className="App">
					{ UserStore.second_chance !== false ? <SecondChanceAuth UserStore={UserStore} second_chance={UserStore.second_chance} /> : '' }
					<Header />
					<p>Authenticated: { UserStore.current_user === null || typeof UserStore.current_user === 'undefined' ? 'No' : 'Yes' }</p>
					
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
				</div>
			</Router>
		);
	}
}

export default App;
