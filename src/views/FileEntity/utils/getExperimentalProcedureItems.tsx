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
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
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
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.max_insert_size'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.mean_insert_size'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.mean_depth'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.mean_read_length'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.experiment_date'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.sequencing_center_id'),
    value: sequencingExperiment?.external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
];

export default getExperimentalProcedureItems;
