import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import App from './components/App';

import getAppBootstrap from './components/api/GetAppBootstrap';

let appElement = document.getElementById('app');
getAppBootstrap()
  .then(b => render(<App bootstrap={b}/>, appElement))
  .catch(err => {
    render(<pre>{JSON.stringify(err, undefined, 4)}</pre>, appElement);
  });




