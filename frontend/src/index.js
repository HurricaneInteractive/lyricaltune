import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'

import UserStore from './stores/UserStore'
import GlobalStore from './stores/GlobalStore'

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const stores = {
    UserStore: UserStore,
    GlobalStore: GlobalStore
}

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
