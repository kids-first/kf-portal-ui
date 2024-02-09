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
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IFileEntity, IFileResultTree, IFileStudyEntity } from 'graphql/files/models';
import { SEARCH_FILES_QUERY } from 'graphql/files/queries';
import { hydrateResults } from 'graphql/models';
import { toNodes } from 'graphql/utils/helpers';
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
import { chunkIt, keepOnly } from 'utils/helper';

import { makeUniqueWords as unique } from '../../helpers';

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
      if (authWindow.closed) {
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
    fileIds: string[];
  },
  { rejectValue: string; state: RootState }
>('passport/cavatica/begin/analyse', async (args, thunkAPI) => {
  if (args.fileIds.length > CAVATICA_FILE_BATCH_SIZE) {
    return thunkAPI.rejectWithValue(CAVATICA_ANALYSE_STATUS.upload_limit_reached);
  }

  const { fences, passport } = thunkAPI.getState();
  const acls: string[] = [];

  for (const fenceKey in fences) {
    const key = fenceKey as FENCE_NAMES;
    if (fences[key].acl !== undefined) {
      acls.concat(fences[key].acl);
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
      first: CAVATICA_FILE_BATCH_SIZE,
    },
  });

  const files = hydrateResults(data?.data?.file?.hits?.edges || []);

  const authorizedFiles = files.filter((file) =>
    userHasAccessToFile(
      file,
      acls,
      passport.cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected,
      fences.gen3.status === FENCE_AUTHENTIFICATION_STATUS.connected,
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

const joinUniquely = (l: string[]) => unique(l).join(',');

const extractFileMetaData = (file: IFileEntity) => ({
  fhir_document_reference: file.fhir_document_reference,
  file_id: file.file_id,
  external_file_id: file.external_id,
  file_name: file.file_name,
  data_category: file.data_category,
  data_type: file.data_type,
  file_format: file.file_format,
  repository: file.repository,
  acl: joinUniquely(file.acl),
  access_url: file.access_urls,
});

const extractParticipantMetaData = (participants: any[]) => {
  const diagnosis = participants.flatMap((participant) => toNodes(participant.diagnosis));
  const outcomes = participants.flatMap((participant) => toNodes(participant.outcomes));
  const phenotype = participants.flatMap((participant) => toNodes(participant.phenotype));
  const relation = participants.flatMap((participant) =>
    toNodes(participant.family.relations_to_proband),
  );

  return {
    participant_ids: joinUniquely(participants.map((x) => x.participant_id)),
    external_participant_ids: joinUniquely(participants.map((x) => x.external_id)),
    proband: joinUniquely(participants.map((x) => `${x.participant_id}: ${x.is_proband}`)),
    ethnicity: joinUniquely(participants.map((x) => x.ethnicity)),
    sex: joinUniquely(participants.map((x) => x.sex)),
    race: joinUniquely(participants.map((x) => x.race)),
    age_at_diagnosis: joinUniquely(diagnosis.map((d) => d.age_at_event_days)),
    age_at_vital_status: joinUniquely(outcomes.map((o) => o.age_at_event_days.value)),
    age_at_observed_phenotype: joinUniquely(phenotype.map((p) => p.age_at_event_days)),
    diagnosis_mondo: joinUniquely(diagnosis.map((d) => d.mondo_id_diagnosis)),
    diagnosis_ncit: joinUniquely(diagnosis.map((d) => d.ncit_id_diagnosis)),
    diagnosis_source_text: joinUniquely(diagnosis.map((d) => d.source_text)),
    family_id: joinUniquely(participants.map((x) => x.families_id)),
    family_composition: joinUniquely(participants.map((x) => x.family_type)),
    family_role: joinUniquely(relation.map((r) => r.role)),
    observed_phenotype_hpo: joinUniquely(phenotype.map((p) => p.hpo_phenotype_observed)),
    not_observed_phenotype_hpo: joinUniquely(phenotype.map((p) => p.hpo_phenotype_not_observed)),
    observed_phenotype_source_text: joinUniquely(
      phenotype.map((p) => p.hpo_phenotype_observed_text),
    ),
    vital_status: joinUniquely(outcomes.map((o) => o.vital_status)),
  };
};

const extractBioSpecimenMetaData = (biospecimens: any[]) => {
  const diagnoses = biospecimens.flatMap((x) => toNodes(x.diagnoses));
  return {
    sample_id: joinUniquely(biospecimens.map((x) => x.sample_id)),
    sample_type: joinUniquely(biospecimens.map((x) => x.sample_type)),
    external_sample_id: joinUniquely(biospecimens.map((x) => x.external_sample_id)),
    collection_sample_type: joinUniquely(biospecimens.map((x) => x.collection_sample_type)),
    age_at_biospecimen_collection: joinUniquely(
      biospecimens.map((x) => x.age_at_biospecimen_collection),
    ),
    age_at_histological_diagnosis: joinUniquely(diagnoses.map((d) => d.age_at_event.value)),
    tumor_descriptor: joinUniquely(diagnoses.map((d) => d.source_text_tumor_descriptor)),
    method_of_sample_procurement: joinUniquely(
      biospecimens.map((d) => d.collection_method_of_sample_procurement),
    ),
    tumor_location: joinUniquely(diagnoses.map((d) => d.source_text_tumor_location)),
    histological_diagnosis_source_text: joinUniquely(diagnoses.map((d) => d.source_text)),
    histological_diagnosis_ncit: joinUniquely(diagnoses.map((d) => d.diagnosis_ncit)),
    histological_diagnosis_mondo: joinUniquely(diagnoses.map((d) => d.diagnosis_mondo)),
    dbgap_consent_code: joinUniquely(biospecimens.map((x) => x.dbgap_consent_code)),
  };
};
const extractSequentialExperimentMetaData = (sequentialExperiments: any[]) => ({
  experimental_strategy: joinUniquely(sequentialExperiments.map((x) => x.experiment_strategy)),
  platform: joinUniquely(sequentialExperiments.map((x) => x.platform)),
  instrument_model: joinUniquely(sequentialExperiments.map((x) => x.instrument_model)),
  library_strand: joinUniquely(sequentialExperiments.map((x) => x.library_strand)),
  is_paired_end: joinUniquely(sequentialExperiments.map((x) => x.is_paired_end)),
});

const extractStudyMetaData = (study: IFileStudyEntity) => ({
  investigation: study.study_code,
  study_name: study.study_name,
  study_program: study.program,
  study_domain: study.domain,
});

export const extractMetadata = (file: IFileEntity) => {
  if (!file || !Object.keys(file).length) {
    return {};
  }

  const sequentialExperiments = toNodes(file.sequencing_experiment);
  const participants = toNodes(file.participants);
  const biospecimens = participants.flatMap((participant) => toNodes(participant.biospecimens));

  const fileMetaData = extractFileMetaData(file);
  const participantsMetaData = extractParticipantMetaData(participants);
  const biospecimensMetaData = extractBioSpecimenMetaData(biospecimens);
  const sequentialExperimentsMetaData = extractSequentialExperimentMetaData(sequentialExperiments);
  const studyMetaData = extractStudyMetaData(file.study);

  return keepOnly({
    ...fileMetaData,
    ...participantsMetaData,
    ...biospecimensMetaData,
    ...sequentialExperimentsMetaData,
    ...studyMetaData,
    reference_genome: null,
  });
};

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
