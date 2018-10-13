import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { 
	BrowserRouter as Router, 
	Route
} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Discover from './pages/Discover'
import Create from './pages/Create'

import SecondChanceAuth from './components/Auth/SecondChanceAuth'
import ErrorPopup from './components/ErrorPopup'

import './App.css';

@inject('UserStore')
@inject('GlobalStore')
@inject('CreateStore')
@inject('AudioStore')
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
		const { UserStore, GlobalStore, CreateStore, AudioStore } = this.props;
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
					<Route path="/create" render={(routerProps) => {
						return <Create
							routerProps={routerProps}
							authenticated={ UserStore.current_user === null ? false : true }
							UserStore={UserStore}
							CreateStore={CreateStore}
							AudioStore={AudioStore}
						/>
					}} />

					<Footer
						authenticated={ UserStore.current_user === null ? false : true }
						UserStore={UserStore}
					/>
				</div>
			</Router>
		);
	}
}

export default App;
