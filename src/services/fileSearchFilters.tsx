import { EntityName } from 'store/fileSearchFiltersTypes';
import { setSqonArrangerCB } from 'store/sqon';

import { resolveBSIdToKfId } from './biospecimen';
import { resolveFileIdToKfId } from './files';
import { resolvePtIdToKfId } from './participants';

type Params = {
  kfId: string;
  entityName: EntityName;
  setSqonCB: setSqonArrangerCB;
};

const shapeSqonFromParticipantId = (participantKfId: string) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.kf_id',
        value: [participantKfId],
      },
    },
  ],
});

const shapeSqonFromBiospecimenId = (biospecimenId: string) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.biospecimens.kf_id',
        value: [biospecimenId],
      },
    },
  ],
});

const shapeSqonFromFileId = (fileId: string) => ({
  op: 'and',
  content: [{ op: 'in', content: { field: 'kf_id', value: [fileId] } }],
});

const buildSqonForFileIndex = (entityName: string, kfId: string) => {
  if (entityName === EntityName.PARTICIPANT) {
    return shapeSqonFromParticipantId(kfId);
  } else if (entityName === EntityName.BIOSPECIMEN) {
    return shapeSqonFromBiospecimenId(kfId);
  } else if (entityName === EntityName.FILE) {
    return shapeSqonFromFileId(kfId);
  }
  return null;
};

export const searchFilesFromKfId = (params: Params) => {
  const { kfId, entityName, setSqonCB } = params;
  const sqon = buildSqonForFileIndex(entityName, kfId);
  setSqonCB(sqon);
};

export const transformIdIntoKfId = async (entityName: string, rawId: string) => {
  if (entityName === EntityName.PARTICIPANT) {
    return await resolvePtIdToKfId(rawId);
  } else if (entityName === EntityName.BIOSPECIMEN) {
    return await resolveBSIdToKfId(rawId);
  } else if (entityName === EntityName.FILE) {
    return await resolveFileIdToKfId(rawId);
  }
  return rawId;
};
