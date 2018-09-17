import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { 
	BrowserRouter as Router, 
	Route
} from 'react-router-dom'

import Header from './components/Header'

import Home from './pages/Home'
import About from './pages/About'
import Discover from './pages/Discover'

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
		console.log(UserStore.current_user)
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
							<ErrorPopup errors={GlobalStore.errors} dismiss={() => GlobalStore.dismissResponseError()} />
						) : ('')
					}
					<Header
						authenticated={ UserStore.current_user === null ? false : true }
						UserStore={UserStore}
					/>
					
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
					<Route path="/discover" component={Discover} />
				</div>
			</Router>
		);
	}
}

export default App;
