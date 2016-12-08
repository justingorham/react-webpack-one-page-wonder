import FetchWrapper from './FetchWrapper';
import StaticContentUrl from './StaticContentUrl';
import React from 'react';
import url from 'url';

const htmlCache = {};

function createMarkup(__html) {
  return {__html};
}

function fixUrlBasedAttribute(regex, fileUrl, htmlBody){
  let m;
  let fixedBody = htmlBody.slice();
  while ((m = regex.exec(fixedBody)) != null) {
    let absPath = url.resolve(fileUrl, m[1]);
    let newSrc = m[0].replace(m[1], absPath);
    fixedBody = fixedBody.replace(m[0], newSrc);
  }
  return fixedBody;
}

export default function ({htmlName, containerElement = 'div'}) {
  let ContainerElement = containerElement;

  if (htmlCache[htmlName]) {
    return Promise.resolve(<ContainerElement dangerouslySetInnerHTML={createMarkup(htmlCache[htmlName])}/>);
  }

  let fileUrl = `${StaticContentUrl()}/${htmlName}`;
  return FetchWrapper(fileUrl)
    .then(response => response.text())
    .then(body => {
      let srcRegex = /src="(\.\.?\/[^"]+)"/gim;
      let posterRegex = /poster="(\.\.?\/[^"]+)"/gim;
      let fixedBody = fixUrlBasedAttribute(srcRegex, fileUrl, body);
      fixedBody = fixUrlBasedAttribute(posterRegex, fileUrl, fixedBody);
      htmlCache[htmlName] = fixedBody;
      return (
        <ContainerElement dangerouslySetInnerHTML={createMarkup(fixedBody)}/>
      );
    });
}
