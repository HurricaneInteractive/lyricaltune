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

import SongGrid from './components/Creation/SongGrid'

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
					<Route path="/create" component={SongGrid} />
				</div>
			</Router>
		);
	}
}

export default App;
