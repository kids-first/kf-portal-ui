import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { IParticipantDiagnosis } from 'graphql/participants/models';
import { capitalize } from 'lodash';
import { extractMondoTitleAndCode } from 'views/DataExploration/utils/helper';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import AgeCell from 'components/AgeCell';

import MondoParticipantCount from '../DiagnosisTable/MondoParticipantCount';

const getDiagnosisDefaultColumns = (): ProColumnType[] => [
  {
    key: 'mondo_display_term',
    title: intl.get('entities.participant.mondo_diagnosis'),
    render: (diagnosis: IParticipantDiagnosis) => {
      const mondoNames = diagnosis?.mondo_display_term;
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
    title: intl.get('entities.participant.diagnosis_NCIT'),
    render: (diagnosis: IParticipantDiagnosis) =>
      diagnosis?.diagnosis_ncit ? (
        <ExternalLink
          href={`http://purl.obolibrary.org/obo/${diagnosis.diagnosis_ncit.replace(':', '_')}`}
        >
          {diagnosis.diagnosis_ncit}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
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
