import intl from 'react-intl-universal';
import { FENCE_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';
import { PASSPORT } from '@ferlab/ui/core/components/Widgets/Cavatica';
import {
  CAVATICA_TYPE,
  ICavaticaTreeNode,
} from '@ferlab/ui/core/components/Widgets/Cavatica/CavaticaAnalyzeModal';
import {
  CAVATICA_ANALYSE_STATUS,
  PASSPORT_AUTHENTIFICATION_STATUS,
} from '@ferlab/ui/core/components/Widgets/Cavatica/type';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { termToSqon } from '@ferlab/ui/core/data/sqon/utils';
import { ISort } from '@ferlab/ui/core/graphql/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IFileEntity, IFileResultTree } from 'graphql/files/models';
import { SEARCH_FILES_QUERY } from 'graphql/files/queries';
import { hydrateResults } from 'graphql/models';
import EnvironmentVariables from 'helpers/EnvVariables';
import { isEmpty } from 'lodash';
import { CAVATICA_FILE_BATCH_SIZE } from 'views/DataExploration/utils/constant';

import { FENCE_NAMES } from 'common/fenceTypes';
import { ArrangerApi } from 'services/api/arranger';
import { CavaticaApi } from 'services/api/cavatica';
import {
  ICavaticaBillingGroup,
  ICavaticaCreateProjectBody,
  ICavaticaDRSImportItem,
  ICavaticaProject,
} from 'services/api/cavatica/models';
import { FenceApi } from 'services/api/fence';
import { globalActions } from 'store/global';
import { RootState } from 'store/types';
import { handleThunkApiReponse } from 'store/utils';
import { userHasAccessToFile } from 'utils/dataFiles';
import { chunkIt } from 'utils/helper';

import { extractMetadata } from './metadata';

const USER_BASE_URL = EnvironmentVariables.configFor('CAVATICA_USER_BASE_URL');
const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

// TODO: Still using the legacy fence authentification, will be changed in the futur for a passport
export const fetchCavaticaAuthentificationStatus = createAsyncThunk<
  {
    status: PASSPORT_AUTHENTIFICATION_STATUS;
    acl: string[];
  },
  void,
  { state: RootState }
>('passport/cavatica/auth/status', async (_, thunkAPI) => {
  const { data, error } = await FenceApi.isAuthenticated(PASSPORT.cavatica);

  let acl: string[] = [];
  if (data?.authenticated) {
    const { data } = await FenceApi.fetchAcls(PASSPORT.cavatica);
    acl = data?.acl || [];
  }

  return handleThunkApiReponse({
    error,
    data: {
      status: data?.authenticated
        ? PASSPORT_AUTHENTIFICATION_STATUS.connected
        : PASSPORT_AUTHENTIFICATION_STATUS.disconnected,
      acl,
    },
    reject: thunkAPI.rejectWithValue,
  });
});

// TODO: Still using the legacy fence authentification, will be changed in the futur for a passport
export const disconnectCavaticaPassport = createAsyncThunk<any>(
  'passport/cavatica/auth/disconnection',
  async (_, thunkAPI) => {
    const { data, error } = await FenceApi.disconnect(PASSPORT.cavatica);

    return handleThunkApiReponse({
      error,
      data,
      reject: thunkAPI.rejectWithValue,
    });
  },
);

// TODO: Still using the legacy fence authentification, will be changed in the futur for a passport
export const connectCavaticaPassport = createAsyncThunk<
  void,
  void,
  {
    state: RootState;
  }
>('passport/cavatica/auth/connection', async (_, thunkAPI) => {
  const { data } = await FenceApi.fetchInfo(PASSPORT.cavatica);
  const authWindow = window.open(data?.authorize_uri)!;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (authWindow?.closed) {
        await thunkAPI.dispatch(fetchCavaticaAuthentificationStatus());
        const {
          passport: {
            cavatica: {
              authentification: { status },
            },
          },
        } = thunkAPI.getState();

        if (status === PASSPORT_AUTHENTIFICATION_STATUS.connected) {
          clearInterval(interval);
          resolve();
        } else {
          clearInterval(interval);
          reject('failed authenticating');
        }
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      reject('nothing');
    }, TEN_MINUTES_IN_MS);
  });
});

export const fetchCavaticaProjects = createAsyncThunk<
  ICavaticaProject[],
  void,
  { rejectValue: string; state: RootState }
>(
  'passport/cavatica/fetch/projects',
  async (_, thunkAPI) => {
    const { data, error } = await CavaticaApi.fetchProjects();
    const projects = data?.items || [];

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    const projectList = await Promise.all(
      (projects || []).map(async (project) => {
        const [memberResponse] = await Promise.all([CavaticaApi.fetchProjetMembers(project.id)]);

        return { ...project, memberCount: memberResponse.data?.items.length || 0 };
      }),
    );

    return projectList.sort((p1, p2) =>
      new Date(p1.modified_on) < new Date(p2.modified_on) ? 1 : -1,
    );
  },
  {
    condition: (_, { getState }) => {
      const { passport } = getState();
      return isEmpty(passport.cavatica.projects.data);
    },
  },
);

export const fetchCavaticaBillingGroups = createAsyncThunk<
  ICavaticaBillingGroup[],
  void,
  { rejectValue: string; state: RootState }
>(
  'passport/cavatica/fetch/billingGroups',
  async (_, thunkAPI) => {
    const { data, error } = await CavaticaApi.fetchBillingGroups();

    return handleThunkApiReponse({
      error,
      data: data?.items || [],
      reject: thunkAPI.rejectWithValue,
    });
  },
  {
    condition: (_, { getState }) => {
      const { passport } = getState();

      return isEmpty(passport.cavatica.billingGroups.data);
    },
  },
);

export const createCavaticaProjet = createAsyncThunk<
  {
    newProject: ICavaticaProject;
  },
  {
    body: ICavaticaCreateProjectBody;
  },
  { rejectValue: string; state: RootState }
>('passport/cavatica/create/project', async (args, thunkAPI) => {
  const { data, error } = await CavaticaApi.createProject(args.body);

  return handleThunkApiReponse({
    error,
    reject: thunkAPI.rejectWithValue,
    onSuccess: () => {
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'success',
          message: intl.get('api.cavatica.success.title'),
          description: intl.get('api.cavatica.success.projects.create'),
        }),
      );
    },
    data: {
      newProject: data!,
    },
  });
});

export const beginCavaticaAnalyse = createAsyncThunk<
  {
    files: IFileEntity[];
    authorizedFiles: IFileEntity[];
  },
  {
    sqon: ISqonGroupFilter;
    sort: ISort[];
    fileIds: string[];
  },
  { rejectValue: string; state: RootState }
>('passport/cavatica/begin/analyse', async (args, thunkAPI) => {
  if (args.fileIds.length > CAVATICA_FILE_BATCH_SIZE) {
    return thunkAPI.rejectWithValue(CAVATICA_ANALYSE_STATUS.upload_limit_reached);
  }

  const { fences, passport } = thunkAPI.getState();
  let acls: string[] = [];

  for (const fenceKey in fences) {
    const key = fenceKey as FENCE_NAMES;
    if (fences[key].acl !== undefined) {
      acls = [...acls, ...fences[key].acl];
    }
  }

  const sqon: ISqonGroupFilter = {
    op: BooleanOperators.and,
    content: [args.sqon],
  };

  if (args.fileIds.length > 0) {
    sqon.content = [
      ...sqon.content,
      termToSqon({
        field: 'file_id',
        value: args.fileIds,
      }),
    ];
  }

  const { data, error } = await ArrangerApi.graphqlRequest<{ data: IFileResultTree }>({
    query: SEARCH_FILES_QUERY.loc?.source.body,
    variables: {
      sqon,
      sort: args.sort,
      first: CAVATICA_FILE_BATCH_SIZE,
    },
  });

  const files = hydrateResults(data?.data?.file?.hits?.edges || []);

  const authorizedFiles = files.filter((file) =>
    userHasAccessToFile(
      file,
      acls,
      passport.cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected,
      fences.dcf.status === FENCE_AUTHENTIFICATION_STATUS.connected,
    ),
  );

  if (!authorizedFiles.length) {
    return thunkAPI.rejectWithValue(CAVATICA_ANALYSE_STATUS.unauthorize);
  }

  if (passport.cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected) {
    thunkAPI.dispatch(fetchCavaticaProjects());
  }

  return handleThunkApiReponse({
    error,
    reject: thunkAPI.rejectWithValue,
    data: {
      files,
      authorizedFiles,
    },
  });
});
export const startBulkImportJob = createAsyncThunk<
  any,
  ICavaticaTreeNode,
  { rejectValue: string; state: RootState }
>('passport/cavatica/bulk/import', async (args, thunkAPI) => {
  const { passport } = thunkAPI.getState();

  const drsItems: ICavaticaDRSImportItem[] = [];
  const type = args.type === CAVATICA_TYPE.PROJECT ? 'project' : 'parent';
  passport.cavatica.bulkImportData.authorizedFiles.forEach((file: IFileEntity) => {
    if (file.index) {
      drsItems.push({
        drs_uri: file.index.urls,
        name: file.index.file_name,
        [type]: args.id,
      });
    }

    drsItems.push({
      drs_uri: file.access_urls,
      name: file.file_name,
      [type]: args.id,
      metadata: extractMetadata(file),
    });
  });

  //https://docs.cavatica.org/reference/start-a-bulk-drs-import-job
  const MAX_NUMBER_OF_ITEMS_PER_API_CALL = 100;
  const chunks: ICavaticaDRSImportItem[][] = chunkIt(drsItems, MAX_NUMBER_OF_ITEMS_PER_API_CALL);

  const responses = await Promise.all(
    chunks.map((items: ICavaticaDRSImportItem[]) => CavaticaApi.startBulkDrsImportJob({ items })),
  );

  const error = responses.find((resp) => !!resp.error);
  return handleThunkApiReponse({
    error: error?.error,
    data: true,
    reject: thunkAPI.rejectWithValue,
    onError: () =>
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'error',
          message: intl.get('api.cavatica.error.title'),
          description: intl.get('api.cavatica.error.bulk.import'),
        }),
      ),
    onSuccess: () =>
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'success',
          message: intl.get('api.cavatica.success.title'),
          description: intl.get('api.cavatica.success.description', {
            destination: args.title,
            userBaseUrl: `${USER_BASE_URL}${
              args.type === CAVATICA_TYPE.PROJECT ? args.id : args.project!
            }`,
          }),
          duration: 5,
        }),
      ),
  });
});
