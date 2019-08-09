import ExternalLink from 'uikit/ExternalLink';
import * as React from 'react';

const style= {wordBreak: "break-word", textTransform: "capitalize"};

const ifNotMatch =value=>{
   if(value === 'undefined'  || value === null || value === ''){
       return <div> -- </div>
  }
   else{
       return <div> {value} </div>
   }
}


const SNOMEDLink = ({snomed}) => {
  const matcher = /^.*SNOMEDCT:(\d+)$/.exec(snomed);
      if(matcher === null){
           return ifNotMatch(snomed)
      }
  const matched = matcher[1];
  return (
    <ExternalLink
      style={style}
      href={`http://snomed.info/id/${matched}`}
    >
      {snomed}
    </ExternalLink>
  );
};

export {SNOMEDLink};

const HPOLink = ({hpo}) => {
  const matcher = /^.*\((HP:\d+)\)$/.exec(hpo);
      if(matcher === null){
           return ifNotMatch(hpo)
      }
  const matched = matcher[1];
  return (
    <ExternalLink
      style={style}
      href={ `https://hpo.jax.org/app/browse/term/${matched}`}
    >
      {hpo}
    </ExternalLink>
  );
};

export {HPOLink};


const MONDOLink = ({mondo}) => {
  const matcher = /^.*\((MONDO:\d+)\)$/.exec(mondo);
    if(matcher === null){
        return ifNotMatch(mondo)
    }
  const matched = matcher[1];

  return (
    <ExternalLink
      style={style}
      href={ `https://monarchinitiative.org/disease/${matched}`}
    >
      {mondo}
    </ExternalLink>
  );
};

export {MONDOLink};



const NCITLink = ({ncit}) => {

  const matcher = /^.*\((NCIT:.\d+)\)$/.exec(ncit);

  if(matcher === null){
        return ifNotMatch(ncit)
  }
  const matched = matcher[1];

  const ncitID = matched.split(":")[1]

  return (
    <ExternalLink
      style={style}
      href={ `https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&ns=ncit&code=${ncitID}`}d
    >
      {ncit}
    </ExternalLink>
  );
};

export {NCITLink};