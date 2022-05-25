import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './app';

const rootEl = document.getElementById('root');

const app = <App name="Yaeger" />;

ReactDOM.render(app, rootEl);
