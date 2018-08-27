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
import ErrorPopup from './components/ErrorPopup'

import './App.css';

@inject('UserStore')
@inject('GlobalStore')
@observer
class App extends Component {
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
		if (GlobalStore.response_error !== null) {
			console.log('Global Error', GlobalStore.response_error.message)
		}
		return (
			<Router>
				<div className="App">
					{ 
						GlobalStore.second_chance !== false ? (
							<SecondChanceAuth UserStore={UserStore} GlobalStore={GlobalStore} second_chance={GlobalStore.second_chance} /> 
						) : ('')
					}
					{
						GlobalStore.response_error !== null ? (
							<ErrorPopup errors={GlobalStore.errors} />
						) : ('')
					}
					<Header />
					<p>Authenticated: { UserStore.current_user === null || typeof UserStore.current_user === 'undefined' ? 'No' : 'Yes' }</p>
					
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />

					<button onClick={(e) => {
						e.preventDefault();
						UserStore.followUser('5b7816566903fd1b5dbd7a95')
					}}>Follow 123</button>
				</div>
			</Router>
		);
	}
}

export default App;
