import StaticContentUrl from './StaticContentUrl';
import url from 'url';

const cache = {};


function addCss(css) {
  return new Promise((resolve, reject) => {
    let cssKey = url.resolve(StaticContentUrl(), css.trim());
    if (cache.hasOwnProperty(cssKey)) {
      cache[cssKey]++;
      return resolve();
    }
    cache[cssKey] = 1;
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', cssKey);
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function removeCss(css) {
  return new Promise((resolve) => {
    let cssKey = url.resolve(StaticContentUrl(), css.trim());
    if (!cache.hasOwnProperty(cssKey) || --cache[cssKey] > 0) {
      return resolve();
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
