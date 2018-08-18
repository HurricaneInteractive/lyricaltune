import React, { Component } from 'react';
import Header from './components/Header'
import Home from './pages/Home'
import './App.css';

class App extends Component {
	componentDidMount() {
		fetch('/users')
			.then(res => res.json())
			.then(j => console.log(j))
			.catch(e => console.error(e))
	}

	render() {
		return (
			<div className="App">
				<Header />
				<Home />
			</div>
		);
	}
}

export default App;
