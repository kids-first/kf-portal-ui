import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getExperimentalProcedureColumns = (): ProColumnType[] => [
  {
    key: 'experiment_strategy',
    dataIndex: 'experiment_strategy',
    title: intl.get('entities.file.experimental_procedure.experimental_strategy'),
    render: (experiment_strategy: string) => experiment_strategy || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'is_paired_end',
    dataIndex: 'is_paired_end',
    title: intl.get('entities.file.experimental_procedure.sequencing_type'),
    render: (is_paired_end: boolean) =>
      is_paired_end
        ? intl.get('entities.file.experimental_procedure.paired_reads')
        : intl.get('entities.file.experimental_procedure.unpaired_reads'),
  },
  {
    key: 'platform',
    dataIndex: 'platform',
    title: intl.get('entities.file.experimental_procedure.platform'),
    render: (platform: string) => platform || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'instrument_model',
    dataIndex: 'instrument_model',
    title: intl.get('entities.file.experimental_procedure.instrument_model'),
    render: (instrument_model: string) => instrument_model || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'library_strand',
    dataIndex: 'library_strand',
    title: intl.get('entities.file.experimental_procedure.library_strand'),
    render: (library_strand: string) => library_strand || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'library_name',
    dataIndex: 'library_name',
    title: intl.get('entities.file.experimental_procedure.library_name'),
    render: (library_name: string) => library_name || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'total_reads',
    dataIndex: 'total_reads',
    title: intl.get('entities.file.experimental_procedure.total_reads'),
    render: (total_reads: number) => total_reads || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'max_insert_size',
    dataIndex: 'max_insert_size',
    title: intl.get('entities.file.experimental_procedure.max_insert_size'),
    render: (max_insert_size: number) => max_insert_size || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'mean_insert_size',
    dataIndex: 'mean_insert_size',
    title: intl.get('entities.file.experimental_procedure.mean_insert_size'),
    render: (mean_insert_size: number) => mean_insert_size || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'mean_depth',
    dataIndex: 'mean_depth',
    title: intl.get('entities.file.experimental_procedure.mean_depth'),
    render: (mean_depth: number) => mean_depth || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'mean_read_length',
    dataIndex: 'mean_read_length',
    title: intl.get('entities.file.experimental_procedure.mean_read_length'),
    render: (mean_read_length: number) => mean_read_length || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'experiment_date',
    dataIndex: 'experiment_date',
    title: intl.get('entities.file.experimental_procedure.experiment_date'),
    render: (experiment_date: string) => experiment_date || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'external_id',
    dataIndex: 'external_id',
    title: intl.get('entities.file.experimental_procedure.sequencing_center_id'),
    render: (external_id: string) => external_id || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
];

export default getExperimentalProcedureColumns;
