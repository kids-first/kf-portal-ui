/* eslint-disable @typescript-eslint/no-unused-vars */
import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getBiospecimensColumns = (): ProColumnType[] => [
  {
    key: 'participant.participant_id',
    dataIndex: 'participant.participant_id',
    title: intl.get('entities.file.participant_sample.participant_id'),
    render: (participant_id: string) => participant_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'study.study_code',
    dataIndex: 'study.study_code',
    title: intl.get('entities.file.participant_sample.study'),
    render: (study_code: string) => study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'participant.is_proband',
    dataIndex: 'participant.is_proband',
    title: intl.get('entities.file.participant_sample.proband'),
    render: (is_proband: boolean) => (is_proband ? intl.get('global.yes') : intl.get('global.no')),
  },
  {
    key: 'sample_id',
    dataIndex: 'sample_id',
    title: intl.get('entities.file.participant_sample.sample_id'),
    render: (sample_id: string) => sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sample_type',
    dataIndex: 'sample_type',
    title: intl.get('entities.file.participant_sample.sample_type'),
    render: (sample_type: string) => sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'composition',
    title: intl.get('entities.file.participant_sample.collection_sample_type'),
    render: (composition: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    key: 'ncit_id_tissue_type',
    dataIndex: 'ncit_id_tissue_type',
    title: intl.get('entities.file.participant_sample.tissue_type_ncit'),
    render: (ncit_id_tissue_type: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    key: 'source_text_tissue_type',
    defaultHidden: true,
    dataIndex: 'source_text_tissue_type',
    title: intl.get('entities.file.participant_sample.tissue_type_source_text'),
    render: (source_text_tissue_type: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    key: 'collection_id',
    defaultHidden: true,
    dataIndex: 'collection_id',
    title: intl.get('entities.file.participant_sample.collection_id'),
    render: (collection_id: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    key: 'participant.external_id',
    defaultHidden: true,
    dataIndex: 'participant.external_id',
    title: intl.get('entities.file.participant_sample.external_participant_id'),
    render: (external_id: string) => external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_aliquot_id',
    defaultHidden: true,
    title: intl.get('entities.file.participant_sample.external_sample_id'),
    render: (external_aliquot_id: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
  {
    key: 'external_sample_id',
    defaultHidden: true,
    title: intl.get('entities.file.participant_sample.external_collection_id'),
    render: (external_sample_id: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  },
];

export default getBiospecimensColumns;
