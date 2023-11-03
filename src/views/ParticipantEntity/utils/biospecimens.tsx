import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IBiospecimenEntity, Status } from 'graphql/biospecimens/models';
import { ArrangerEdge } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import AgeCell from 'components/AgeCell';

import CollectionIdLink from '../BiospecimenTable/CollectionIdLink';

export const getBiospecimensDefaultColumns = (): ProColumnType[] => [
  {
    key: 'sample_id',
    title: intl.get('entities.biospecimen.sample_id'),
    render: (biospecimen: IBiospecimenEntity) => biospecimen.sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'collection_sample_id',
    title: intl.get('entities.biospecimen.collection_id'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen.collection_sample_id ? (
        <CollectionIdLink collectionId={biospecimen?.collection_sample_id} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'sample_type',
    title: intl.get('entities.biospecimen.sample_type'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'collection_sample_type',
    title: intl.get('entities.biospecimen.collection_sample_type'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.collection_sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'age_at_biospecimen_collection',
    title: intl.get('entities.participant.age'),
    tooltip: intl.get('entities.biospecimen.age_tooltip'),
    render: (biospecimen: IBiospecimenEntity) => (
      <AgeCell ageInDays={biospecimen?.age_at_biospecimen_collection} />
    ),
  },
  {
    key: 'collection_ncit_anatomy_site_id',
    title: intl.get('entities.biospecimen.anatomical_site_NCIT'),
    defaultHidden: true,
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.collection_ncit_anatomy_site_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'collection_anatomy_site',
    title: intl.get('entities.biospecimen.anatomical_site'),
    defaultHidden: true,
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.collection_anatomy_site || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'collection_ncit_id_tissue_type',
    title: intl.get('entities.biospecimen.ncit_id_tissue_type'),
    dataIndex: 'collection_ncit_id_tissue_type',
    defaultHidden: true,
    render: (ncit_id_tissue_type) => ncit_id_tissue_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'tissue_type_source_text',
    title: intl.get('entities.biospecimen.tissue_type_source_text'),
    dataIndex: 'tissue_type_source_text',
    defaultHidden: true,
    render: (tissue_type_source_text) => tissue_type_source_text || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'source_text_tumor_descriptor',
    title: intl.get('entities.biospecimen.source_text_tumor_descriptor'),
    dataIndex: 'source_text_tumor_descriptor',
    defaultHidden: true,
    render: (source_text_tumor_descriptor) =>
      source_text_tumor_descriptor || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'source_text_tumor_location',
    title: intl.get('entities.biospecimen.source_text_tumor_location'),
    defaultHidden: true,
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.source_text_tumor_location || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'dbgap_consent_code',
    title: intl.get('entities.biospecimen.dbgap_consent_code'),
    defaultHidden: true,
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.dbgap_consent_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'consent_type',
    title: intl.get('entities.biospecimen.consent_type'),
    defaultHidden: true,
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.consent_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'volume',
    title: intl.get('entities.biospecimen.volume'),
    render: (biospecimen: IBiospecimenEntity) => biospecimen?.volume || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'volume_unit',
    title: intl.get('entities.biospecimen.volume_unit'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.volume_unit || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'status',
    title: intl.get('entities.biospecimen.sample_availabilty'),
    defaultHidden: true,
    render: (biospecimen: IBiospecimenEntity) => {
      const status = biospecimen?.status;
      if (!status) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return status === Status.AVAILABLE ? intl.get('global.yes') : intl.get('global.no');
    },
  },
  {
    key: 'parent_sample_id',
    title: intl.get('entities.biospecimen.parent_sample_id'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.parent_sample_id || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'parent_sample_type',
    title: intl.get('entities.biospecimen.parent_sample_type'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.parent_sample_type || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
];

const filterDuplicateBiospecimens = (
  currentBiospecimen: ArrangerEdge<IBiospecimenEntity>,
  index: number,
  biospecimenArray: ArrangerEdge<IBiospecimenEntity>[],
) =>
  biospecimenArray.findIndex((biospecimen) => {
    if (biospecimen.node.container_id) {
      return (
        biospecimen.node.container_id === currentBiospecimen.node.container_id &&
        biospecimen.node.sample_id === currentBiospecimen.node.sample_id
      );
    }
    return biospecimen.node.sample_id === currentBiospecimen.node.sample_id;
  }) === index;

export const getBiospecimensFromParticipant = (
  participant?: IParticipantEntity,
): { biospecimens: IBiospecimenEntity[]; total: number } => {
  const files =
    participant?.files?.hits?.edges?.map((e) => ({ key: e.node.file_id, ...e.node })) || [];

  const biospecimens = files
    .flatMap((file) => file.biospecimens?.hits?.edges)
    .filter(filterDuplicateBiospecimens)
    .map((bio) => ({ key: bio.node.container_id || bio.node.sample_id, ...bio.node }));

  return { biospecimens: biospecimens || [], total: biospecimens.length || 0 };
};
