import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IArrangerEdge } from '@ferlab/ui/core/graphql/types';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity } from 'graphql/files/models';
import { IParticipantEntity } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const extractConsentCodes = (file?: IFileEntity): string => {
  const l: string[] = (file?.participants?.hits?.edges || []).reduce(
    (xs: string[], x: IArrangerEdge<IParticipantEntity>): string[] => {
      const consentCodes = x.node.biospecimens?.hits?.edges
        ?.filter((y) => y.node.dbgap_consent_code)
        .map((y) => y.node.dbgap_consent_code);
      return [...consentCodes, ...xs];
    },
    [],
  );

  return l.length > 0 ? [...new Set(l)].join(', ') : TABLE_EMPTY_PLACE_HOLDER;
};

const getDataAccessItems = (file?: IFileEntity): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.file.data_access.access'),
    value: file?.controlled_access || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.data_access.dbgap_accession_number'),
    value:
      (file?.study.external_id && (
        <ExternalLink
          href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${file.study.external_id}`}
        >
          {file.study.external_id}
        </ExternalLink>
      )) ||
      TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.data_access.consent_codes'),
    value: extractConsentCodes(file),
  },
];

export default getDataAccessItems;
