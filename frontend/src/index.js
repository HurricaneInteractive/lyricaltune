import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'

import TestStore from './stores/TestStore'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider TestStore={TestStore}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
