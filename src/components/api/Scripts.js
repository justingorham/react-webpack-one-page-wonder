import StaticContentUrl from './StaticContentUrl';
import url from 'url';

const cache = {};


function addScriptTag(js) {
  return new Promise((resolve, reject) => {
    let jsKey = url.resolve(StaticContentUrl(), js.trim());
    if (cache.hasOwnProperty(jsKey)) {
      cache[jsKey]++;
      return resolve();
    }
    cache[jsKey] = 1;

    let script = document.createElement('script');
    script.setAttribute('src', jsKey);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);

  });
}

function removeScriptTag(js) {
  return new Promise((resolve) => {
    let jsKey = url.resolve(StaticContentUrl(), js.trim());
    if (!cache.hasOwnProperty(jsKey) || --cache[jsKey] > 0) {
      return resolve();
    }

    delete cache[jsKey];
    let scripts = document.querySelectorAll(`script[src="${jsKey}"]`);
    scripts.forEach(script => {
      script.parentNode.removeChild(script);
    });
    resolve();
  });
}


export {addScriptTag, removeScriptTag};
