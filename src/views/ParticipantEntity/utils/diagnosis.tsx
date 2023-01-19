import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantDiagnosis } from 'graphql/participants/models';
import { capitalize } from 'lodash';
import {
  extractMondoTitleAndCode,
  extractNcitTissueTitleAndCode,
} from 'views/DataExploration/utils/helper';
import { readableDistanceByDays } from 'utils/dates';

export const getDiagnosisDefaultColumns = (): ProColumnType[] => [
  {
    key: 'mondo_id_diagnosis',
    title: intl.get('screen.participantEntity.diagnosis.mondo'),
    render: (diagnosis: IParticipantDiagnosis) => {
      const mondoNames = diagnosis.mondo_id_diagnosis;
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={[mondoNames]}
          renderItem={(mondo_id, index): React.ReactNode => {
            const mondoInfo = extractMondoTitleAndCode(mondo_id);
            return mondoInfo ? (
              <div key={index}>
                {capitalize(mondoInfo.title)} (MONDO:
                <ExternalLink href={`http://purl.obolibrary.org/obo/MONDO_${mondoInfo.code}`}>
                  {mondoInfo.code}
                </ExternalLink>
                )
              </div>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            );
          }}
        />
      );
    },
  },
  {
    key: 'diagnosis_ncit',
    title: intl.get('screen.participantEntity.diagnosis.ncit'),
    render: (diagnosis: IParticipantDiagnosis) => {
      const ncitId = diagnosis.ncit_id_diagnosis;
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={[ncitId]}
          renderItem={(ncit_id_diagnosis, index): React.ReactNode => {
            const ncitInfo = extractNcitTissueTitleAndCode(ncit_id_diagnosis);
            return ncitInfo ? (
              <div key={index}>
                {capitalize(ncitInfo.title)} (NCIT:
                <ExternalLink href={`http://purl.obolibrary.org/obo/NCIT_${ncitInfo.code}`}>
                  {ncitInfo.code}
                </ExternalLink>
                )
              </div>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            );
          }}
        />
      );
    },
  },
  {
    key: 'diagnosis_source_text',
    title: intl.get('screen.participantEntity.diagnosis.sourceText'),
    render: (mondo: IParticipantDiagnosis) => {
      const sourceTexts = mondo.source_text;

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
    title: intl.get('screen.participantEntity.diagnosis.age.title'),
    tooltip: intl.get('screen.participantEntity.diagnosis.age.tooltip'),
    render: (diagnosis: IParticipantDiagnosis) =>
      diagnosis.age_at_event_days
        ? readableDistanceByDays(diagnosis.age_at_event_days)
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  // TODO: Need to be added
  {
    key: 'diagnosis_category',
    title: intl.get('screen.participantEntity.diagnosis.category'),
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
  // TODO: Need to be added
  {
    key: 'diagnosis_mondo_shared_term',
    title: intl.get('screen.participantEntity.diagnosis.sharedTerm'),
    sorter: {
      multiple: 1,
    },
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
];
