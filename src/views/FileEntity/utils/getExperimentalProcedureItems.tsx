import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity } from 'graphql/files/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getExperimentalProcedureItems = (file?: IFileEntity): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.file.experimental_procedure.experimental_strategy'),
    value: file?.sequencing_experiment.experiment_strategy || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.sequencing_type'),
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    label: intl.get('entities.file.experimental_procedure.platform'),
    value: file?.sequencing_experiment.platform || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.instrument_model'),
    value: file?.sequencing_experiment.instrument_model || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.library_strand'),
    value: file?.sequencing_experiment.library_strand || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.file.experimental_procedure.library_name'),
    value: file?.sequencing_experiment.library_name || TABLE_EMPTY_PLACE_HOLDER,
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
    value: TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
];

export default getExperimentalProcedureItems;
