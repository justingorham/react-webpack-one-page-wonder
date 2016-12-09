import React from 'react';
import GenericSection from './GenericSection';


export default function factory(bootstrap, currentSection, key=""){
  if(currentSection.sections && Array.isArray(currentSection.sections)){
    let containerType = currentSection.containerType || 'div';
    let {id, className} = currentSection;
    let attr = Object.assign({},{id,className});
    let children = currentSection.sections.map((s,i)=>factory(bootstrap,s,`${key}.${i}`));
    return (<containerType key={key} {...attr}>
      {children}
    </containerType>);
  }
  return <GenericSection key={key} {...currentSection} {...bootstrap}/>;
}
