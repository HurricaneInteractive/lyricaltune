import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { 
	BrowserRouter as Router, 
	Route
} from 'react-router-dom'

// import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import SecondChanceAuth from './components/Auth/SecondChanceAuth'
import ErrorPopup from './components/ErrorPopup'

import SongGridWithMultiplePhrases from './components/Creation/SongGridWithMultiplePhrases'

import './App.css';

@inject('UserStore')
@inject('GlobalStore')
@observer
class App extends Component {
	constructor() {
		super()

		this.state = {
			current_user: null
		}
	}

	componentDidMount() {
		const that = this
		this.props.UserStore.getCurrentUser()
			.then(res => {
				if (res.hasOwnProperty('current_user')) {
					that.setState({
						current_user: res.current_user
					})
				}
			})
			.catch(e => console.error(e))
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		const { UserStore, GlobalStore } = this.props;
		if (this.state.current_user === null) {
			return <h1>Loading</h1>
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
							<ErrorPopup errors={GlobalStore.errors} dismiss={() => GlobalStore.dismissResponseError()} />
						) : ('')
					}
					<Route exact path="/" component={Home} />
					<Route path="/about" component={About} />
					<Route path="/create" render={() => (
						<SongGridWithMultiplePhrases GlobalStore={GlobalStore} UserStore={UserStore} current_user={this.state.current_user} />
					)} />
				</div>
			</Router>
		);
	}
}

export default App;
