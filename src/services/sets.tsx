import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';
import { ApiConfig } from 'store/apiTypes';
import {
  ArrangerUserSet,
  CreateSetParams,
  SetSourceType,
  SetSubActionTypes,
  SetUpdateInputData,
} from 'store/saveSetTypes';

export const getSetAndParticipantsCountByUser = async (
  api: (config: ApiConfig) => Promise<ArrangerUserSet[]>,
) =>
  api({
    url: `${kfArrangerApiRoot}sets`,
    method: 'GET',
  });

export const createSet = async (
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  params: CreateSetParams,
) => {
  const { type, sqon, path, sort, tag } = params;
  return api({
    url: `${kfArrangerApiRoot}sets`,
    method: 'POST',
    body: {
      projectId: arrangerApiProjectId,
      type,
      sqon,
      idField: path,
      sort,
      tag,
    },
  });
};

export const deleteSets = async (api: (config: ApiConfig) => Promise<boolean>, setId: string) =>
  api({
    url: `${kfArrangerApiRoot}sets/${setId}`,
    method: 'DELETE',
  });

export const updateSet = async (
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  sourceType: SetSourceType,
  data: SetUpdateInputData,
  subAction: SetSubActionTypes,
  setId: string,
) => {
  const { sqon, newTag } = data;

  return api({
    url: `${kfArrangerApiRoot}sets/${setId}`,
    method: 'PUT',
    body: {
      projectId: arrangerApiProjectId,
      sourceType,
      subAction,
      sqon,
      newTag,
    },
  });
};
