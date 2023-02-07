import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity } from 'graphql/files/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

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
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
];

export default getDataAccessItems;
