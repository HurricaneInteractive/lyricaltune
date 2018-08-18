import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Header from './components/Header'
import Home from './pages/Home'
import './App.css';

@inject('TestStore')
@observer
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
				<h2>List length: {this.props.TestStore.list.length}</h2>
				<button onClick={(e) => {
					e.preventDefault();
					this.props.TestStore.updateList('Hello');
				}}>Add item to list</button>
			</div>
		);
	}
}

export default App;
