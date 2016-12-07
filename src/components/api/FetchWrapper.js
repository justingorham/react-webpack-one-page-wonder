import 'whatwg-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(`${response.status} ${response.url}`);
    let {status, url} = response;
    error.response = {status, url};
    throw error;
  }
}

export default function () {
  return fetch(...arguments)
    .then(checkStatus);
}
