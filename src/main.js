import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import StaticContentUrl from './components/api/StaticContentUrl';
import getAppBootstrap from './components/api/GetAppBootstrap';


let runningAppPromise;

function mainPromise({baseUrl, bootstrapUrl, containerId}, resolve, reject) {
  let appElement = document.getElementById(containerId || 'app');
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
      bootstrapUrl: "bootstrap.json",
      containerId: "app"
    }, appBootstrapJson);
    runningAppPromise = new Promise(mainPromise.bind(undefined, objBootstrap));
  }
  return runningAppPromise;
}


