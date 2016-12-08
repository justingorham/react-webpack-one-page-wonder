import StaticContentUrl from './StaticContentUrl';
import url from 'url';

const cache = {};

function addScriptTag(js) {
  let jsKey = url.resolve(StaticContentUrl(), js.trim());
  if (cache.hasOwnProperty(jsKey)) {
    cache[jsKey].count++;
    return cache[jsKey].promise;
  }
  cache[jsKey] = {
    count:1
  };
  cache[jsKey].promise = new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.setAttribute('src', jsKey);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return cache[jsKey].promise;
}

function removeScriptTag(js) {
  return new Promise((resolve) => {
    let jsKey = url.resolve(StaticContentUrl(), js.trim());
    if (!cache.hasOwnProperty(jsKey) || --cache[jsKey].count > 0) {
      return cache[jsKey].promise;
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
