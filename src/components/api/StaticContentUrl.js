let root = window.location.origin.slice();
export default function(url){
  if(url){
    root = url.slice();
  }
  return root;
};
