import url from 'url';
import StaticContentUrl from './StaticContentUrl';
import {addCss, removeCss} from './Css';
import {addScriptTag, removeScriptTag} from './Scripts';

const addFuncs = {
  css: addCss,
  js: addScriptTag
};

const removeFuncs = {
  css: removeCss,
  js: removeScriptTag
};


function extension(fileUrl) {
  return fileUrl.split('.').pop().trim().toLowerCase();
}

export function add(fileUrl, {dependencies}) {

  let key = url.resolve(StaticContentUrl, fileUrl.trim());
  let task = Promise.resolve();
  if (dependencies && dependencies.hasOwnProperty(key)) {
    task = Promise.all(dependencies[key].map(j => add(j, {dependencies})));
  }

  let ext = extension(fileUrl);
  let action = addFuncs[ext];

  return task
    .then(() => action ? action(key) : Promise.resolve());
}

export function remove(fileUrl, {dependencies}){
  let key = url.resolve(StaticContentUrl, fileUrl.trim());
  let ext = extension(fileUrl);
  let action = removeFuncs[ext];
  let task = action ? action(key) : Promise.resolve();
  return task
    .then(()=>{
      if (dependencies && dependencies.hasOwnProperty(key)) {
        return Promise.all(dependencies[key].map(j => remove(j, {dependencies})));
      }
      return Promise.resolve();
    });
}
