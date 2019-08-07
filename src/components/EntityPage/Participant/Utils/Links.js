import ExternalLink from '../../../../uikit/ExternalLink';
import * as React from 'react';

const style= {wordBreak: "break-word", textTransform: "capitalize"};

const SNOMEDLink = ({snomed}) => {
  const matcher = /^.*SNOMEDCT:(\d+)$/.exec(snomed);
  const matched = matcher[1];

  return (
    <ExternalLink
      style={style}
      href={`https://bioportal.bioontology.org/ontologies/SNOMEDCT?p=classes&conceptid=${matched}`}
    >
      {snomed}
    </ExternalLink>
  );
};

export {SNOMEDLink};

const HPOLink = ({hpo}) => {
  const matcher = /^.*\((HP:\d+)\)$/.exec(hpo);
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