import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IBiospecimenEntity, Status } from 'graphql/biospecimens/models';
import { ArrangerEdge } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

import AgeCell from '../AgeCell';
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
    key: 'container_id',
    title: intl.get('entities.biospecimen.container_id'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.container_id || TABLE_EMPTY_PLACE_HOLDER,
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
    key: 'laboratory_procedure',
    title: intl.get('entities.biospecimen.laboratory_procedure'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.laboratory_procedure || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
  },
  {
    key: 'biospecimen_storage',
    title: intl.get('entities.biospecimen.biospecimen_storage'),
    render: (biospecimen: IBiospecimenEntity) =>
      biospecimen?.biospecimen_storage || TABLE_EMPTY_PLACE_HOLDER,
    defaultHidden: true,
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
