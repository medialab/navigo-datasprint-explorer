import ReactDOM from 'react-dom';
import React from 'react';
import App from './src/components/App'

import('./src/styles.css');
import('bulma/css/bulma.min.css');

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('app')
);