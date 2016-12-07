import StaticContentUrl from './StaticContentUrl';
import fetchWrapper from './FetchWrapper';

const getImage = function getImage(imageUrl) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      resolve();
    };
    img.onerror = () => {
      reject(new Error(`Error loading ${imageUrl}`));
    };
    img.src = imageUrl;
  });
};

const prefetchImages = function prefetchImages() {
  return fetchWrapper(`${StaticContentUrl}/index.json`)
    .then(response => response.json())
    .then(data => data.filter(d => d.match(/.*\.(jpg|png|gif)$/gi)))
    .then(imageList => Promise.all(imageList.map(i => getImage(`${StaticContentUrl}/${i}`))));
};

export default prefetchImages;

