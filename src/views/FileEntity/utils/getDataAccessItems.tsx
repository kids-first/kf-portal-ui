import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity } from 'graphql/files/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getDataAccessItems = (file?: IFileEntity): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.file.data_access.access'),
    value: file?.controlled_access || TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.data_access.dbgap_accession_number'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.data_access.consent_codes'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
];

export default getDataAccessItems;
