import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { ISequencingExperiment } from 'graphql/files/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getExperimentalProcedureItems = (
  sequencingExperiment?: ISequencingExperiment,
): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.file.experimental_procedure.experimental_strategy'),
    value: sequencingExperiment?.experiment_strategy || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.sequencing_type'),
    value: sequencingExperiment?.is_paired_end
      ? intl.get('entities.file.experimental_procedure.paired_reads')
      : intl.get('entities.file.experimental_procedure.unpaired_reads'),
  },
  {
    label: intl.get('entities.file.experimental_procedure.platform'),
    value: sequencingExperiment?.platform || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.instrument_model'),
    value: sequencingExperiment?.instrument_model || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.library_strand'),
    value: sequencingExperiment?.library_strand || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.library_name'),
    value: sequencingExperiment?.library_name || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.total_reads'),
    value: sequencingExperiment?.total_reads || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.max_insert_size'),
    value: sequencingExperiment?.max_insert_size || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.mean_insert_size'),
    value: sequencingExperiment?.mean_insert_size
      ? Number(sequencingExperiment?.mean_insert_size).toFixed(3)
      : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.mean_depth'),
    value: sequencingExperiment?.mean_depth || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.mean_read_length'),
    value: sequencingExperiment?.mean_read_length || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.experiment_date'),
    value: sequencingExperiment?.experiment_date || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.sequencing_center_id'),
    value: sequencingExperiment?.external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
];

export default getExperimentalProcedureItems;
