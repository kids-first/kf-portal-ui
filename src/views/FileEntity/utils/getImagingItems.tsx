import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink/index';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IFileEntity, IImagingData } from 'graphql/files/models';
import { joinUniqueCleanWords } from 'helpers';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { STATIC_ROUTES } from 'utils/routes';

import styles from '../index.module.css';

const getImagingItems = (
  imagingData?: Partial<IImagingData> &
    Pick<IFileEntity, 'imaging_sequence_types' | 'imaging_techniques' | 'flywheel_url'>,
): IEntityDescriptionsItem[] => [
  {
    label: (
      <Tooltip
        className={styles.tooltip}
        title={intl.get('entities.file.imaging.modality.tooltip')}
      >
        {intl.get('entities.file.imaging.modality.value')}
      </Tooltip>
    ),
    value: imagingData?.modality || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.sequence_type'),
    value: imagingData?.imaging_sequence_types
      ? joinUniqueCleanWords(imagingData?.imaging_sequence_types)
      : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.imaging.technique'),
    value: imagingData?.imaging_techniques
      ? joinUniqueCleanWords(imagingData?.imaging_techniques)
      : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: (
      <Tooltip
        className={styles.tooltip}
        title={intl.get('entities.file.imaging.body_part.tooltip')}
      >
        {intl.get('entities.file.imaging.body_part.value')}
      </Tooltip>
    ),
    value: imagingData?.info_body_part_examined || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: (
      <Tooltip
        className={styles.tooltip}
        title={intl.get('entities.file.imaging.device.field_strength.tooltip')}
      >
        {intl.get('entities.file.imaging.device.field_strength.value')}
      </Tooltip>
    ),
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
    label: (
      <Tooltip
        className={styles.tooltip}
        title={intl.get('entities.file.imaging.session.tooltip')}
        placement="topLeft"
      >
        {intl.get('entities.file.imaging.session.label')}
      </Tooltip>
    ),
    value: imagingData?.session_n_total_acquisitions ? (
      <Link
        to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
        onClick={() =>
          addQuery({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            query: generateQuery({
              newFilters: [
                generateValueFilter({
                  field: 'imaging.session_id',
                  value: [imagingData?.session_id!],
                  index: INDEXES.FILE,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
        style={{ textDecoration: 'underline' }}
      >
        {imagingData?.session_n_total_acquisitions}
      </Link>
    ) : (
      TABLE_EMPTY_PLACE_HOLDER
    ),
  },
  {
    label: intl.get('entities.file.imaging.acquisition_number'),
    value: imagingData?.acquisition_number ? (
      <Link
        to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
        onClick={() =>
          addQuery({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            query: generateQuery({
              newFilters: [
                generateValueFilter({
                  field: 'imaging.acquisition_number',
                  value: [imagingData?.acquisition_number!],
                  index: INDEXES.FILE,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
        style={{ textDecoration: 'underline' }}
      >
        {imagingData?.acquisition_number}
      </Link>
    ) : (
      TABLE_EMPTY_PLACE_HOLDER
    ),
  },
  {
    label: intl.get('entities.file.imaging.device.id'),
    value: imagingData?.device?.device_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.flywheel_url'),
    value: imagingData?.flywheel_url ? (
      <ExternalLink className={styles.link} href={imagingData?.flywheel_url}>
        {imagingData?.flywheel_url}
      </ExternalLink>
    ) : (
      TABLE_EMPTY_PLACE_HOLDER
    ),
  },
];

export default getImagingItems;
