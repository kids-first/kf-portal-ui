import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantPhenotype } from 'graphql/participants/models';
import { capitalize } from 'lodash';
import { extractPhenotypeTitleAndCode } from 'views/DataExploration/utils/helper';
import { readableDistanceByDays } from 'utils/dates';

export const getPhenotypeDefaultColumns = (): ProColumnType[] => [
  {
    key: 'hpo_phenotype_observed',
    title: intl.get('screen.participantEntity.phenotype.hpoPhenotypeObserved'),
    render: (phenotype: IParticipantPhenotype) => {
      const phenotypeNames = phenotype.hpo_phenotype_observed;
      if (!phenotypeNames || phenotypeNames.length === 0) {
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
    key: 'hpo_phenotype_source_text',
    title: intl.get('screen.participantEntity.phenotype.sourceText'),
    render: (phenotype: IParticipantPhenotype) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'interpretation',
    title: intl.get('screen.participantEntity.phenotype.interpretation'),
    render: (phenotype: IParticipantPhenotype) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'age_at_event_days',
    title: intl.get('screen.participantEntity.phenotype.age.title'),
    tooltip: intl.get('screen.participantEntity.phenotype.age.tooltip'),
    render: (phenotype: IParticipantPhenotype) =>
      phenotype.age_at_event_days
        ? readableDistanceByDays(phenotype.age_at_event_days)
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'shared_term',
    title: intl.get('screen.participantEntity.phenotype.sharedTerm'),
    render: (phenotype: IParticipantPhenotype) => TABLE_EMPTY_PLACE_HOLDER,
  },
];
