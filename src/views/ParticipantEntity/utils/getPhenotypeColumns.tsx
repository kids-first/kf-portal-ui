import React from 'react';
import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { Tag } from 'antd';
import { IParticipantPhenotype } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import AgeCell from 'components/AgeCell';
import { OntologyTermWithLink } from 'components/Cells';

import HpoParticipantCount from '../PhenotypeTable/HpoParticipantCount';

const getPhenotypeDefaultColumns = (): ProColumnType[] => [
  {
    key: 'hpo_phenotype',
    title: intl.get('entities.participant.phenotype_hpo'),
    dataIndex: 'hpo_phenotype',
    render: (hpo_phenotype: string) => (
      <OntologyTermWithLink
        term={hpo_phenotype}
        type={'hpo'}
        hrefWithoutCode={'http://purl.obolibrary.org/obo/HP_'}
      />
    ),
  },
  {
    key: 'source_text',
    title: intl.get('entities.participant.phenotype_source_text'),
    render: (phenotype: IParticipantPhenotype) =>
      phenotype?.source_text ? phenotype.source_text : TABLE_EMPTY_PLACE_HOLDER,
    width: '30%',
  },
  {
    key: 'is_observed',
    title: intl.get('entities.participant.interpretation'),
    render: (phenotype: IParticipantPhenotype) => (
      <Tag color={phenotype?.is_observed ? 'green' : ''}>
        {phenotype?.is_observed
          ? intl.get('entities.participant.observed')
          : intl.get('entities.participant.not_observed')}
      </Tag>
    ),
    width: '15%',
  },
  {
    key: 'age_at_event_days',
    title: intl.get('entities.participant.age'),
    tooltip: intl.get('entities.participant.age_tooltip_phenotype'),
    render: (phenotype: IParticipantPhenotype) => (
      <AgeCell ageInDays={phenotype?.age_at_event_days} />
    ),
    width: '10%',
  },
  {
    key: 'hpo_term',
    title: intl.get('entities.participant.hpo_term'),
    tooltip: intl.get('entities.participant.hpo_term_tooltip'),
    render: (phenotype: IParticipantPhenotype) =>
      phenotype?.hpo_phenotype_observed ? (
        <HpoParticipantCount phenotype={phenotype.hpo_phenotype_observed} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    width: '10%',
  },
];

export default getPhenotypeDefaultColumns;
