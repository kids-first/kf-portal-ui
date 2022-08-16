import flatMap from 'lodash/flatMap';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ALL_STUDIES_FENCE_NAMES, FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { isEmpty } from 'lodash';
import { RootState } from 'store/types';
import { TFenceStudies, TFenceStudiesIdsAndCount, TFenceStudy } from './types';
import { AxiosError } from 'axios';
import { handleThunkApiReponse } from 'store/utils';
import { ArrangerApi } from 'services/api/arranger';
import { FileAccessType } from 'graphql/files/models';
import { BooleanOperators, TermOperators } from '@ferlab/ui/core/data/sqon/operators';

const fetchAllFenceStudies = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: RootState }
>('fenceStudies/fetch/all/studies', async (args, thunkAPI) => {
  const { fenceConnection } = thunkAPI.getState();

  ALL_STUDIES_FENCE_NAMES.forEach(
    async (fenceName) =>
      await thunkAPI.dispatch(
        fetchFenceStudies({
          fenceName,
          userAcls: fenceConnection.fencesAcls[fenceName],
        }),
      ),
  );
});

const fetchFenceStudies = createAsyncThunk<
  TFenceStudies,
  {
    fenceName: FENCE_NAMES;
    userAcls: string[];
  },
  { rejectValue: string; state: RootState }
>(
  'fenceStudies/fetch/studies',
  async (args, thunkAPI) => {
    const { studies, error: authStudyError } = await getAuthStudyIdsAndCounts(
      args.userAcls,
      args.fenceName,
    );

    const { authorizedStudies, error: studiesCountError } = isEmpty(studies)
      ? { authorizedStudies: [], error: undefined }
      : await getStudiesCountByNameAndAcl(studies!, args.userAcls);

    return handleThunkApiReponse({
      error: authStudyError || studiesCountError,
      data: {
        [args.fenceName]: {
          authorizedStudies: authorizedStudies!,
        },
      },
      reject: thunkAPI.rejectWithValue,
    });
  },
  {
    condition: (args, { getState }) => {
      const { fenceStudies, fenceConnection } = getState();

      const studies = fenceStudies.studies[args.fenceName];
      const hasNoAuthorizedStudies = isEmpty(studies) || isEmpty(studies.authorizedStudies);
      const hasNotBeenDisconnected = [
        FENCE_CONNECTION_STATUSES.unknown,
        FENCE_CONNECTION_STATUSES.connected,
      ].includes(fenceConnection.connectionStatus[args.fenceName]);

      return (
        isEmpty(fenceStudies.studies[args.fenceName]) &&
        hasNoAuthorizedStudies &&
        hasNotBeenDisconnected
      );
    },
  },
);

const getStudiesCountByNameAndAcl = async (
  studies: TFenceStudiesIdsAndCount,
  userAcls: string[],
): Promise<{
  error?: AxiosError;
  authorizedStudies?: TFenceStudy[];
}> => {
  const studyIds = Object.keys(studies);

  const sqons = studyIds.reduce(
    (obj, studyId) => ({
      ...obj,
      [`${replaceDashByUnderscore(studyId)}_sqon`]: {
        op: TermOperators.in,
        content: { field: 'participants.study.study_id', value: [studyId] },
      },
    }),
    {},
  );

  const { data, error } = await ArrangerApi.graphqlRequest({
    query: `
    query StudyCountByNamesAndAcl(${studyIds.map(
      (studyId) => `$${replaceDashByUnderscore(studyId)}_sqon: JSON`,
    )}) {          
      file {
        ${studyIds
          .map(
            (studyId) => `
          ${replaceDashByUnderscore(studyId)}: aggregations(filters: $${replaceDashByUnderscore(
              studyId,
            )}_sqon, aggregations_filter_themselves: true) {
            acl {
              buckets {
                key
              }
            }
            participants__study__study_name{
              buckets{
                key
                doc_count
              }
            } 
          }
        `,
          )
          .join('')}
      }
    }
    `,
    variables: sqons,
  });

  if (error) {
    return {
      authorizedStudies: undefined,
      error,
    };
  }

  const {
    data: { file },
  } = data;

  return {
    authorizedStudies: studyIds.map((id) => {
      const studyId = replaceDashByUnderscore(id);
      const agg = file[studyId];

      return {
        acl: agg['acl']['buckets'].map((a: any) => a.key).filter((b: any) => b.includes('.')),
        studyShortName: agg['participants__study__study_name']['buckets'][0]['key'],
        totalFiles: agg['participants__study__study_name']['buckets'][0]['doc_count'],
        id,
        authorizedFiles: studies[id].authorizedFiles,
      };
    }),
  };
};

const getAuthStudyIdsAndCounts = async (
  userAcls: string[],
  fenceName: FENCE_NAMES,
): Promise<{
  error?: AxiosError;
  studies?: TFenceStudiesIdsAndCount;
}> => {
  const { data, error } = await ArrangerApi.graphqlRequest<any>({
    query: `
    query AuthorizedStudyIdsAndCount($sqon: JSON) {
      file {
        aggregations(filters: $sqon, aggregations_filter_themselves: true, include_missing: false){
          participants__study__study_id {
            buckets
              {
                key
                doc_count
              }
            }
          }
        }
      }
    `,
    variables: {
      sqon: {
        op: BooleanOperators.or,
        content: [
          {
            op: BooleanOperators.and,
            content: [
              { op: TermOperators.in, content: { field: 'acl', value: userAcls } },
              { op: TermOperators.in, content: { field: 'repository', value: fenceName } },
            ],
          },
          {
            op: BooleanOperators.and,
            content: [
              {
                op: TermOperators.in,
                content: { field: 'access_control', value: [FileAccessType.REGISTERED] },
              },
            ],
          },
        ],
      },
    },
  });

  if (error) {
    return {
      studies: undefined,
      error,
    };
  }

  const {
    data: {
      file: {
        aggregations: {
          participants__study__study_id: { buckets },
        },
      },
    },
  } = data;

  return {
    studies: buckets.reduce(
      (obj: TFenceStudies, { key, doc_count }: { key: string; doc_count: number }) => ({
        ...obj,
        [key]: { authorizedFiles: doc_count },
      }),
      {},
    ),
  };
};

export const computeAllFencesAuthStudies = (fenceStudies: TFenceStudies) => {
  if (isEmpty(fenceStudies)) {
    return [];
  }
  return flatMap(Object.values(fenceStudies), (studies) => studies.authorizedStudies);
};

const replaceDashByUnderscore = (value: string) => value.replaceAll('-', '');

export { fetchFenceStudies, fetchAllFenceStudies };
