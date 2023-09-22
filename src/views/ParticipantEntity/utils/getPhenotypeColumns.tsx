import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { Tag } from 'antd';
import { IParticipantPhenotype } from 'graphql/participants/models';
import { capitalize } from 'lodash';
import { extractPhenotypeTitleAndCode } from 'views/DataExploration/utils/helper';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

import AgeCell from '../AgeCell';
import HpoParticipantCount from '../PhenotypeTable/HpoParticipantCount';
const getPhenotypeDefaultColumns = (): ProColumnType[] => [
  {
    key: 'hpo_phenotype',
    title: intl.get('entities.participant.phenotype_hpo'),
    render: (phenotype: IParticipantPhenotype) => {
      const phenotypeNames = phenotype?.hpo_phenotype;
      if (!phenotypeNames) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={[phenotypeNames]}
          renderItem={(hpo_id_phenotype, index): React.ReactNode => {
            const phenotypeInfo = extractPhenotypeTitleAndCode(hpo_id_phenotype);

            return phenotypeInfo ? (
              <div key={index}>
                {capitalize(phenotypeInfo.title)} (HP:
                <ExternalLink href={`http://purl.obolibrary.org/obo/HP_${phenotypeInfo.code}`}>
                  {phenotypeInfo.code}
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
    key: 'source_text',
    title: intl.get('entities.participant.phenotype_source_text'),
    render: (phenotype: IParticipantPhenotype) =>
      phenotype?.source_text ? phenotype.source_text : TABLE_EMPTY_PLACE_HOLDER,
    width: '30%',
  },
  {
    key: 'observed',
    title: intl.get('entities.participant.interpretation'),
    render: (phenotype: IParticipantPhenotype) => (
      // TODO when field is_observed ready: <Tag color={phenotype?.is_observed ? 'green' : ''}>
      // graphql broken
      <Tag color={phenotype?.observed ? 'green' : ''}>
        {phenotype?.observed
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
    render: (phenotype: IParticipantPhenotype) =>
      phenotype.age_at_event_days ? (
        <AgeCell ageInDays={phenotype.age_at_event_days} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
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
