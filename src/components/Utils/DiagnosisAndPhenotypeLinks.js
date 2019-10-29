import ExternalLink from 'uikit/ExternalLink';
import * as React from 'react';
import { isFunction } from 'lodash';

const style = { wordBreak: 'break-word', textTransform: 'capitalize' };

const generateLink = (diagnosisDescription, config) => {
  const { referenceRegex, hrefStaticPart, matcherTransform } = config;
  const matcher = referenceRegex.exec(diagnosisDescription);
  if (matcher === null) {
    return <div> {diagnosisDescription || '--'} </div>;
  }
  const extractedReference = isFunction(matcherTransform)
    ? matcherTransform(matcher[1])
    : matcher[1];
  return (
    <ExternalLink style={style} href={`${hrefStaticPart}${extractedReference}`}>
      {diagnosisDescription}
    </ExternalLink>
  );
};

const SNOMEDLink = ({ snomed }) => {
  return generateLink(snomed, {
    referenceRegex: /^.*SNOMEDCT:(\d+)$/,
    hrefStaticPart: 'http://snomed.info/id/',
  });
};

export { SNOMEDLink };

const HPOLink = ({ hpo }) =>
  generateLink(hpo, {
    referenceRegex: /^.*\((HP:\d+)\)$/,
    hrefStaticPart: 'https://hpo.jax.org/app/browse/term/',
  });

export { HPOLink };

const MONDOLink = ({ mondo }) => {
  return generateLink(mondo, {
    referenceRegex: /^.*\((MONDO:\d+)\)$/,
    hrefStaticPart: 'https://monarchinitiative.org/disease/',
  });
};

export { MONDOLink };

const NCITLink = ({ ncit }) =>
  generateLink(ncit, {
    referenceRegex: /^.*\((NCIT:.\d+)\)$/,
    hrefStaticPart:
      'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&ns=ncit&code=',
    matcherTransform: matched => matched.split(':')[1],
  });

export { NCITLink };
