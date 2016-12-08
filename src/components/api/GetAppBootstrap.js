import FetchWrapper from './FetchWrapper';
import StaticContentUrl from './StaticContentUrl';
import url from 'url';

let mainBootstrap = null;

export default function (bootstrapLocation) {
  if(mainBootstrap){
    return Promise.resolve(Object.assign({},mainBootstrap));
  }
  let bootstrapUrl = url.resolve(StaticContentUrl(), bootstrapLocation || 'bootstrap.json');
  return FetchWrapper(bootstrapUrl)
    .then(response => response.json())
    .then(json => {
      if (!json.aliases) {
        return json;
      }
      let aliases = json.aliases;
      delete json.aliases;
      let fixedJsonString = JSON.stringify(json);
      // console.log(fixedJsonString);
      Object.keys(aliases).forEach(a => {
        fixedJsonString = fixedJsonString.replace(new RegExp(`\{\{${a}\}\}`, 'g'), aliases[a]);
      });

      let fixedJson = JSON.parse(fixedJsonString);
      if (fixedJson.dependencies) {
        let dMap = {};
        Object.keys(fixedJson.dependencies).forEach(key => {
          dMap[url.resolve(StaticContentUrl(), key)] = fixedJson.dependencies[key].map(d => url.resolve(StaticContentUrl(), d));
        });
        fixedJson.dependencies = dMap;
      }
      mainBootstrap = fixedJson;
      return Object.assign({}, fixedJson);
    });
}
