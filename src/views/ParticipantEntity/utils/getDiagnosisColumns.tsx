import React from 'react';
import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { IParticipantDiagnosis } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import AgeCell from 'components/AgeCell';
import { OntologyTermWithLink } from 'components/Cells';

import MondoParticipantCount from '../DiagnosisTable/MondoParticipantCount';

import styles from 'views/DataExploration/components/PageContent/tabs/Participants/index.module.css';

const getDiagnosisDefaultColumns = (): ProColumnType[] => [
  {
    key: 'mondo_display_term',
    title: intl.get('entities.participant.mondo_diagnosis'),
    className: styles.diagnosisCell,
    dataIndex: 'mondo_display_term',
    render: (mondo_display_term: string) => (
      <OntologyTermWithLink
        term={mondo_display_term}
        type={'mondo'}
        hrefWithoutCode={'http://purl.obolibrary.org/obo/MONDO_'}
      />
    ),
  },
  {
    key: 'ncit_display_term',
    title: intl.get('entities.participant.diagnosis_NCIT'),
    dataIndex: 'ncit_display_term',
    render: (ncit_display_term: string) => (
      <OntologyTermWithLink
        term={ncit_display_term}
        type={'ncit'}
        hrefWithoutCode={'http://purl.obolibrary.org/obo/NCIT_'}
      />
    ),
  },
  {
    key: 'source_text',
    title: intl.get('entities.participant.diagnosis_source_text'),
    render: (diagnosis: IParticipantDiagnosis) => {
      const sourceTexts = diagnosis?.source_text;

      if (!sourceTexts || sourceTexts.length === 0) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={[sourceTexts]}
          renderItem={(sourceText, index): React.ReactNode => <div key={index}>{sourceText}</div>}
        />
      );
    },
  },
  {
    key: 'age_at_event_days',
    title: intl.get('entities.participant.age'),
    tooltip: intl.get('entities.participant.age_tooltip_diagnosis'),
    render: (diagnosis: IParticipantDiagnosis) => (
      <AgeCell ageInDays={diagnosis?.age_at_event_days} />
    ),
  },
  {
    key: 'mondo_term',
    title: intl.get('entities.participant.mondo_term'),
    tooltip: intl.get('entities.participant.mondo_term_tooltip'),
    render: (diagnosis: IParticipantDiagnosis) =>
      diagnosis?.mondo_display_term ? (
        <MondoParticipantCount diagnosis={diagnosis.mondo_display_term} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
];

export default getDiagnosisDefaultColumns;
