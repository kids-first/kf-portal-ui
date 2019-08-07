import { isNumber } from 'util';
import { pick, cloneDeep, get } from 'lodash';
import urlJoin from 'url-join';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { personaApiRoot, shortUrlApi } from 'common/injectGlobals';
import { getDefaultSqon } from 'common/sqonUtils';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const COHORT_BUILDER_DRAFT_LOCALSTORAGE_KEY = 'DRAFT_VIRTUAL_STUDY';
const DRAFT_FIELDS = [
  'sqons',
  'activeIndex',
  'name',
  'description',
  'uid',
  'virtualStudyId',
  'dirty',
];

/**
 * Normalizes a study coming from Riff into the format used in the application.
 * @param {Object} studyData - A virtual study coming from Riff
 */
const normalizeRiffVirtualStudy = studyData => ({
  sqons: get(studyData, 'content.sqons', getDefaultSqon()),
  activeIndex: get(studyData, 'content.activeIndex', 0),
  virtualStudyId: studyData.id || null,
  name: studyData.alias || '',
  description: get(studyData, 'content.description', ''),
  uid: studyData.uid || null,
  sharedPublicly: studyData.sharedPublicly || false,
  creationDate: studyData.creationDate || '',
});

/**
 * Validates the given Virtual Study `study`, returning a fixed clone of it if an error is detected.
 * This allows to prevent bugs accross versions or side-effects from another bug, client-side or server-side,
 * that could create a corrupted study.
 * @param {Object} study - A virtual study
 * @returns {Object} - A copy of the study, with detected errors corrected, or `null` if mandatory fields are missing.
 */
const validateStudy = study => {
  if (typeof study !== 'object' || study === null) return null;
  if (!Array.isArray(study.sqons)) return null;

  // fix the study if any data corruption happened
  const validatedStudy = cloneDeep(study);

  // if study index got out of bound, reset it to the latest index.
  if (!isNumber(study.activeIndex) || study.activeIndex < 0) {
    validatedStudy.activeIndex = 0;
  }
  if (validatedStudy.activeIndex > validatedStudy.sqons.length - 1) {
    validatedStudy.activeIndex = validatedStudy.sqons.length - 1;
  }

  // If any other property is missing or of wrong type, just put a default value.
  if (typeof validatedStudy.name !== 'string') {
    validatedStudy.name = '';
  }
  validatedStudy.name = validatedStudy.name.trim();

  if (typeof validatedStudy.description !== 'string') {
    validatedStudy.description = '';
  }
  validatedStudy.description = validatedStudy.description.trim();

  if (typeof validatedStudy.uid !== 'string') {
    validatedStudy.uid = null;
  }

  if (typeof validatedStudy.virtualStudyId !== 'string') {
    validatedStudy.virtualStudyId = null;
  }

  if (validatedStudy.dirty !== true) {
    validatedStudy.dirty = false;
  }

  return validatedStudy;
};

export const createVirtualStudy = (
  virtualStudyId = null,
  name = '',
  description = '',
  sqons = getDefaultSqon(),
  activeIndex = 0,
  uid = null,
  sharedPublicly = false,
  dirty = false,
) =>
  validateStudy({
    virtualStudyId,
    name,
    description,
    sqons,
    activeIndex,
    uid,
    sharedPublicly,
    dirty,
  });

export const getVirtualStudies = async (api, egoId) => {
  const riffVirtualStudiesPromise = getVirtualStudiesFromRiff(api, egoId);
  const personaDataPromise = getVirtualStudiesFromPersona(api, egoId);

  return Promise.all([riffVirtualStudiesPromise, personaDataPromise])
    .then(([riffVirtualStudies, personaVirtualStudies]) => {
      return riffVirtualStudies.filter(rvs =>
        personaVirtualStudies.some(pvs => get(pvs, 'id', null) === rvs.virtualStudyId),
      );
    })
    .catch(err => {
      throw new Error(`Failed to load virtual studies for user "${egoId} :\n${err.message}`);
    });
};

const getVirtualStudiesFromRiff = async (api, egoId) =>
  api({
    url: urlJoin(shortUrlApi, 'user', egoId),
    method: 'GET',
  }).then(result => {
    return result.map(normalizeRiffVirtualStudy).map(validateStudy);
  });

const getVirtualStudiesFromPersona = async api =>
  api({
    url: urlJoin(personaApiRoot, 'graphql', 'PERSONA_SAVED_VIRTUAL_STUDIES'),
    body: {
      query: print(gql`
        {
          self {
            virtualStudies {
              id
              name
            }
          }
        }
      `),
    },
  }).then(personaData => get(personaData, 'data.self.virtualStudies', []));

const updateStudiesInPersona = async (api, loggedInUser, newVirtualStudy) => {
  const { virtualStudyId: id, name } = newVirtualStudy;
  const { egoId, _id: personaRecordId } = loggedInUser;

  const currentVirtualStudies = await getVirtualStudiesFromPersona(api);

  let studyFound = false;
  const virtualStudies = currentVirtualStudies.reduce((studies, study) => {
    if (study.id === id) {
      studyFound = true;
      return studies.concat({ id, name });
    }
    return studies.concat(study);
  }, []);

  if (!studyFound) {
    virtualStudies.push({ id, name });
  }

  return await api({
    url: urlJoin(personaApiRoot, 'graphql', 'PERSONA_UPDATE_VIRTUAL_STUDIES'),
    body: {
      variables: {
        egoId,
        virtualStudies,
        personaRecordId,
      },
      query: print(gql`
        mutation(
          $virtualStudies: [UserModelUserModelVirtualStudiesInput]
          $egoId: String
          $personaRecordId: MongoID!
        ) {
          userUpdate(
            record: { egoId: $egoId, virtualStudies: $virtualStudies, _id: $personaRecordId }
          ) {
            record {
              firstName
              email
              virtualStudies {
                name
                id
              }
            }
          }
        }
      `),
    },
  });
};

export const createNewVirtualStudy = async (api, loggedInUser, study) => {
  const validatedStudy = validateStudy(study);
  const { sqons, activeIndex, name, description } = validatedStudy;
  const { egoId } = loggedInUser;

  const newVirtualStudy = await api({
    url: urlJoin(shortUrlApi, 'shorten'),
    body: JSON.stringify({
      userid: egoId,
      alias: name,
      sharedPublicly: false,
      content: {
        sqons,
        activeIndex,
        description,
      },
    }),
  });

  const normalizedStudy = createVirtualStudy(
    newVirtualStudy.id,
    newVirtualStudy.alias,
    newVirtualStudy.content.description,
    newVirtualStudy.content.sqons,
    newVirtualStudy.content.activeIndex,
    newVirtualStudy.uid,
    newVirtualStudy.sharedPublicly,
    false,
  );

  trackUserInteraction({
    category: TRACKING_EVENTS.categories.virtualStudies,
    action: TRACKING_EVENTS.actions.save,
    label: JSON.stringify(normalizedStudy),
  });

  await updateStudiesInPersona(api, loggedInUser, normalizedStudy);

  const updatedStudies = await getVirtualStudies(api, egoId);

  return [normalizedStudy, updatedStudies];
};

export const getVirtualStudy = api => virtualStudyId => {
  if (!virtualStudyId) {
    return Promise.reject(new Error(`Failed to load virtual study: expected an "id"`));
  }

  return api({
    method: 'GET',
    url: urlJoin(shortUrlApi, virtualStudyId),
  })
    .then(normalizeRiffVirtualStudy)
    .then(validateStudy)
    .catch(err => {
      throw new Error(`Failed to load virtual study ${virtualStudyId} with error:\n${err.message}`);
    });
};

export const updateVirtualStudy = async (api, loggedInUser, study) => {
  const { egoId } = loggedInUser;
  let existingVirtualStudy = null;

  try {
    existingVirtualStudy = await getVirtualStudy(api)(study.virtualStudyId);
  } catch (err) {
    return Promise.reject(`Failed to update virtual study ${study.virtualStudyId}: ${err.message}`);
  }

  const validatedStudy = validateStudy(study);
  const { virtualStudyId, sqons, activeIndex, name, description } = validatedStudy;

  const updatedStudy = await api({
    method: 'PUT',
    url: urlJoin(shortUrlApi, virtualStudyId),
    body: JSON.stringify({
      alias: name,
      sharedPublicly: existingVirtualStudy.sharedPublicly || false,
      content: {
        sqons,
        activeIndex,
        description,
      },
    }),
  });

  const normalizedStudy = createVirtualStudy(
    updatedStudy.id,
    updatedStudy.alias,
    updatedStudy.content.description,
    updatedStudy.content.sqons,
    updatedStudy.content.activeIndex,
    updatedStudy.uid,
    updatedStudy.sharedPublicly,
    false,
  );

  trackUserInteraction({
    category: TRACKING_EVENTS.categories.virtualStudies,
    action: TRACKING_EVENTS.actions.edit,
    label: JSON.stringify(normalizedStudy),
  });

  await updateStudiesInPersona(api, loggedInUser, normalizedStudy);

  const updatedStudies = await getVirtualStudies(api, egoId);

  return [normalizedStudy, updatedStudies];
};

export const deleteVirtualStudy = async ({ loggedInUser, api, virtualStudyId }) => {
  if (!virtualStudyId.length) {
    throw new Error('Study must have name');
  }
  const { egoId, _id: personaRecordId } = loggedInUser;
  const virtualStudies = await getVirtualStudiesFromPersona(api);
  await api({
    url: urlJoin(shortUrlApi, virtualStudyId),
    method: 'DELETE',
    body: JSON.stringify({
      userid: egoId,
    }),
  });
  const newVirtualStudies = virtualStudies.filter(obj => obj.id !== virtualStudyId);
  return await api({
    url: urlJoin(personaApiRoot, 'graphql', 'PERSONA_UPDATE_VIRTUAL_STUDIES'),
    body: {
      variables: {
        egoId,
        virtualStudies: newVirtualStudies,
        personaRecordId,
      },
      query: print(gql`
        mutation(
          $virtualStudies: [UserModelUserModelVirtualStudiesInput]
          $egoId: String
          $personaRecordId: MongoID!
        ) {
          userUpdate(
            record: { egoId: $egoId, virtualStudies: $virtualStudies, _id: $personaRecordId }
          ) {
            record {
              firstName
              email
              virtualStudies {
                name
                id
              }
            }
          }
        }
      `),
    },
  });
};

export const loadDraftVirtualStudy = () => {
  let virtualStudy = null;
  const savedLocalState = localStorage.getItem(COHORT_BUILDER_DRAFT_LOCALSTORAGE_KEY);
  try {
    virtualStudy = JSON.parse(savedLocalState);
  } catch (err) {
    console.error(`Error loading draft Virtual Study "${savedLocalState}"`, err);
    localStorage.setItem(COHORT_BUILDER_DRAFT_LOCALSTORAGE_KEY, null);
  }

  return virtualStudy === null ? null : pick(validateStudy(virtualStudy), DRAFT_FIELDS);
};

export const saveDraftVirtualStudy = virtualStudy => {
  localStorage.setItem(
    COHORT_BUILDER_DRAFT_LOCALSTORAGE_KEY,
    JSON.stringify(pick(validateStudy(virtualStudy), DRAFT_FIELDS)),
  );
};
