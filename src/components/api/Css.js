import StaticContentUrl from './StaticContentUrl';
import url from 'url';

const cache = {};

function addCss(css) {
  let cssKey = url.resolve(StaticContentUrl(), css.trim());
  if (cache.hasOwnProperty(cssKey)) {
    cache[cssKey].count++;
    return cache[cssKey].promise;
  }

  cache[cssKey] = {count:1};
  cache[cssKey].promise = new Promise((resolve, reject) => {
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', cssKey);
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
  return cache[cssKey].promise;
}

function removeCss(css) {
  return new Promise((resolve) => {
    let cssKey = url.resolve(StaticContentUrl(), css.trim());
    if (!cache.hasOwnProperty(cssKey) || --cache[cssKey].count > 0) {
      return cache[cssKey].promise;
    }

    delete cache[cssKey];
    let links = document.querySelectorAll(`link[href="${cssKey}"]`);
    links.forEach(link => {
      link.parentNode.removeChild(link);
    });
    resolve();
  });
}

export {addCss, removeCss};
