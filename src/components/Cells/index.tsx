import React from 'react';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink/index';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell/index';
import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IBiospecimenDiagnoses } from 'graphql/biospecimens/models';
import { IParticipantDiagnosis } from 'graphql/participants/models';
import { capitalize, kebabCase } from 'lodash';
import {
  extractMondoTitleAndCode,
  extractNcitTitleAndCode,
  extractPhenotypeTitleAndCode,
} from 'views/DataExploration/utils/helper';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

type TOntologyType = 'mondo' | 'ncit' | 'hpo';

const getTitleCode = (type: TOntologyType, term: string) => {
  if (type === 'mondo') {
    return extractMondoTitleAndCode(term);
  } else if (type === 'ncit') {
    return extractNcitTitleAndCode(term);
  } else if (type === 'hpo') {
    return extractPhenotypeTitleAndCode(term);
  }
  return null;
};

const getCodePrefix = (type: TOntologyType) => {
  if (type === 'mondo') {
    return 'MONDO:';
  } else if (type === 'ncit') {
    return 'NCIT:';
  } else if (type === 'hpo') {
    return 'HP:';
  }
  return '';
};

const TermWithLink = ({
  type,
  termReactKey,
  term,
  hrefWithoutCode,
}: {
  term: string;
  type: TOntologyType;
  termReactKey: string;
  hrefWithoutCode?: string;
}) => {
  const tc = getTitleCode(type, term);
  if (!tc) {
    return null;
  }

  const { title, code } = tc;
  const codePrefix = getCodePrefix(type);
  return hrefWithoutCode ? (
    <div key={termReactKey}>
      {capitalize(title)} (
      <ExternalLink href={`${hrefWithoutCode}${code}`}>
        {codePrefix} {code}
      </ExternalLink>
      )
    </div>
  ) : (
    <div key={termReactKey}>
      {capitalize(title)} ({codePrefix} {code})
    </div>
  );
};

interface IPropsOntologyTermsWithLinksFromDiagnoses {
  dxs: IArrangerResultsTree<IParticipantDiagnosis | IBiospecimenDiagnoses>;
  type: 'mondo' | 'ncit';
  hrefWithoutCode?: string;
}
export const OntologyTermsWithLinksFromDiagnoses = ({
  dxs,
  type,
  hrefWithoutCode,
}: IPropsOntologyTermsWithLinksFromDiagnoses) => {
  const isMondo = type === 'mondo';
  const terms = [
    ...new Set(
      dxs?.hits?.edges?.map((e) =>
        isMondo ? e.node.mondo_display_term : e.node.ncit_display_term,
      ),
    ),
  ];

  return terms.filter((t) => !!t).length === 0 ? (
    <>{TABLE_EMPTY_PLACE_HOLDER}</>
  ) : (
    <ExpandableCell
      nOfElementsWhenCollapsed={3}
      dataSource={terms}
      renderItem={(term: string, index: string): React.ReactNode =>
        TermWithLink({
          type,
          termReactKey: `${index}-${kebabCase(term)}`,
          term,
          hrefWithoutCode,
        })
      }
    />
  );
};

interface IPropsOntologyTerm {
  term: string;
  type: TOntologyType;
  hrefWithoutCode?: string;
}
export const OntologyTermWithLink = ({ term, type, hrefWithoutCode }: IPropsOntologyTerm) =>
  term ? (
    TermWithLink({ type, termReactKey: `${kebabCase(term)}`, term, hrefWithoutCode })
  ) : (
    <>{TABLE_EMPTY_PLACE_HOLDER}</>
  );

interface IPropsOntologyTerms {
  terms: string[];
  type: TOntologyType;
  hrefWithoutCode?: string;
}
export const OntologyTermsWithLinks = ({ terms, type, hrefWithoutCode }: IPropsOntologyTerms) => {
  const cleanedUpTerms = terms ? [...new Set(terms.filter((t) => !!t))] : [];
  return (
    <>
      {cleanedUpTerms.length > 0 ? (
        <ExpandableCell
          nOfElementsWhenCollapsed={3}
          dataSource={cleanedUpTerms}
          renderItem={(t: string, index: string): React.ReactNode => (
            <OntologyTermWithLink
              key={`${index}${kebabCase(t)}`}
              term={t}
              type={type}
              hrefWithoutCode={hrefWithoutCode}
            />
          )}
        />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      )}
    </>
  );
};
