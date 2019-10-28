import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts/Gotham-Thin.otf'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
