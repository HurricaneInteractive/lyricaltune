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
@inject('GlobalStore')
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
		this.props.UserStore.getCurrentUser()
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		const { UserStore, GlobalStore } = this.props;
		return (
			<Router>
				<div className="App">
					{ GlobalStore.second_chance !== false ? <SecondChanceAuth UserStore={UserStore} GlobalStore={GlobalStore} second_chance={GlobalStore.second_chance} /> : '' }
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
