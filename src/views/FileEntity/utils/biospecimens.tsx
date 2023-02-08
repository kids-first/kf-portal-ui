import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IFileEntity } from 'graphql/files/models';
import { IParticipantStudy } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { STATIC_ROUTES } from 'utils/routes';

export const getBiospecimenColumns = (): ProColumnType[] => [
  {
    key: 'participant_id',
    dataIndex: 'participant_id',
    title: intl.get('entities.file.participant_sample.participant_id'),
    render: (participant_id: string) =>
      participant_id ? (
        <Link to={`${STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}/${participant_id}`}>
          {participant_id}
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'study.study_code',
    dataIndex: 'study',
    title: intl.get('entities.file.participant_sample.study'),
    render: (study?: IParticipantStudy) => study?.study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'is_proband',
    dataIndex: 'is_proband',
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
    key: 'collection_sample_type',
    dataIndex: 'collection_sample_type',
    title: intl.get('entities.file.participant_sample.collection_sample_type'),
    render: (collection_sample_type: string) => collection_sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  // {
  //   key: 'ncit_id_tissue_type',
  //   dataIndex: 'ncit_id_tissue_type',
  //   title: intl.get('entities.file.participant_sample.tissue_type_ncit'),
  //   render: (ncit_id_tissue_type: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  // },
  // {
  //   key: 'source_text_tissue_type',
  //   defaultHidden: true,
  //   dataIndex: 'source_text_tissue_type',
  //   title: intl.get('entities.file.participant_sample.tissue_type_source_text'),
  //   render: (source_text_tissue_type: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  // },
  {
    key: 'collection_sample_id',
    defaultHidden: true,
    dataIndex: 'collection_sample_id',
    title: intl.get('entities.file.participant_sample.collection_id'),
    render: (collection_sample_id: string) => collection_sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_id',
    defaultHidden: true,
    dataIndex: 'external_id',
    title: intl.get('entities.file.participant_sample.external_participant_id'),
    render: (external_id: string) => external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  // {
  //   key: 'external_aliquot_id',
  //   defaultHidden: true,
  //   title: intl.get('entities.file.participant_sample.external_sample_id'),
  //   render: (external_aliquot_id: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  // },
  // {
  //   key: 'external_sample_id',
  //   defaultHidden: true,
  //   title: intl.get('entities.file.participant_sample.external_collection_id'),
  //   render: (external_sample_id: string) => TABLE_EMPTY_PLACE_HOLDER, // TODO
  // },
];

export const getBiospecimensFromFile = (file?: IFileEntity) => {
  const participantEdges =
    file?.participants?.hits?.edges?.map((e) => ({
      key: e.node.participant_id,
      ...e.node,
    })) || [];

  return participantEdges.flatMap((participant) =>
    participant.biospecimens.hits.edges.map((biospecimen) => ({
      key: biospecimen.node.sample_id,
      participant_id: participant.participant_id,
      is_proband: participant.is_proband,
      external_id: participant.external_id,
      study: participant.study,
      ...biospecimen.node,
    })),
  );
};
