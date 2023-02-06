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
    key: 'experiment_date',
    dataIndex: 'experiment_date',
    title: intl.get('entities.file.experimental_procedure.experiment_date'),
    render: (experiment_date: string) => experiment_date || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_id',
    dataIndex: 'external_id',
    title: intl.get('entities.file.experimental_procedure.sequencing_center_id'),
    render: (external_id: string) => external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
];

export default getExperimentalProcedureColumns;
