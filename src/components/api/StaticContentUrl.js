let url = (window.bundleOpts || {}).contentRoot;
if(!url){
  throw new Error('undefined contentRoot in bundleOpts');
}
const root = url.slice();
export default root;
