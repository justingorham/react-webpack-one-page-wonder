import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import StaticContentUrl from './components/api/StaticContentUrl';
import getAppBootstrap from './components/api/GetAppBootstrap';

let appElement = document.getElementById('app');
getAppBootstrap()
  .then(b => render(<App bootstrap={b}/>, appElement))
  .catch(err => {
    render(<pre>{JSON.stringify(err, undefined, 4)}</pre>, appElement);
  });


let runningAppPromise;

function mainPromise({baseUrl, bootstrapUrl}, resolve, reject) {
  StaticContentUrl(baseUrl);
  getAppBootstrap(bootstrapUrl)
    .then(b => render(<App bootstrap={b} resolve={resolve}/>, appElement))
    .catch(err => {
      render(<pre>{JSON.stringify(err, undefined, 4)}</pre>, appElement);
      reject(err);
    });
}

export default function main(appBootstrapJson) {
  if (!runningAppPromise) {
    let objBootstrap = Object.assign({
      baseUrl: window.location.origin,
      bootstrapUrl: "bootstrap.json"
    }, appBootstrapJson)
    runningAppPromise = new Promise(mainPromise.bind(undefined, objBootstrap));
  }
  return runningAppPromise;
}


