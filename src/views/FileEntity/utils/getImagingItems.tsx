import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity, IImagingData } from 'graphql/files/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getImagingItems = (
  imagingData?: Partial<IImagingData> &
    Pick<IFileEntity, 'imaging_sequence_type' | 'imaging_technique'>,
): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.file.imaging.modality'),
    value: imagingData?.modality || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.sequence_type'),
    value: imagingData?.imaging_sequence_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.technique'),
    value: imagingData?.imaging_technique || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.device.field_strength'),
    value: imagingData?.device?.magnetic_field_strength || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.device.manufacturer'),
    value: imagingData?.device?.manufacturer || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.device.model'),
    value: imagingData?.device?.model_name || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.device.id'),
    value: imagingData?.device?.device_id || TABLE_EMPTY_PLACE_HOLDER,
  },
];

export default getImagingItems;
