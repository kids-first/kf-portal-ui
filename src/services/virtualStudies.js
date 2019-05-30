import { isNumber } from 'util';
import { pick } from 'lodash';
import urlJoin from 'url-join';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { personaApiRoot, shortUrlApi } from 'common/injectGlobals';
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

const isValidStudy = value => value && Array.isArray(value.sqons) && isNumber(value.activeIndex);

export const getSavedVirtualStudyNames = async api =>
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
  });

const updateStudiesInPersona = async (api, loggedInUser, newVirtualStudy) => {
  const { id, alias: name } = newVirtualStudy;
  const { egoId, _id: personaRecordId } = loggedInUser;

  const {
    data: {
      self: { virtualStudies: currentVirtualStudies },
    },
  } = await getSavedVirtualStudyNames(api);

  // const virtualStudies = currentVirtualStudies.some(vs => vs.id === id) ?
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

export const createNewVirtualStudy = async ({
  sqonsState,
  loggedInUser,
  api,
  name = '',
  description = '',
}) => {
  if (!name.length) {
    throw new Error('Study must have name');
  }
  const { sqons, activeIndex } = sqonsState;
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

  trackUserInteraction({
    category: TRACKING_EVENTS.categories.virtualStudies,
    action: TRACKING_EVENTS.actions.save,
    label: JSON.stringify(newVirtualStudy),
  });

  const {
    data: {
      userUpdate: {
        record: { virtualStudies: updatedStudies },
      },
    },
  } = await updateStudiesInPersona(api, loggedInUser, newVirtualStudy);

  return [newVirtualStudy, updatedStudies];
};

export const getVirtualStudy = api => virtualStudyId => {
  if (!virtualStudyId) {
    return Promise.reject(new Error(`Failed to load virtual study: expected an "id"`));
  }

  return api({
    method: 'GET',
    url: urlJoin(shortUrlApi, virtualStudyId),
  }).catch(err => {
    throw new Error(`Failed to load virtual study ${virtualStudyId} with error:\n${err.message}`);
  });
};

export const updateVirtualStudy = async ({
  sqonsState,
  api,
  loggedInUser,
  name,
  description = '',
}) => {
  const { sqons, activeIndex, virtualStudyId } = sqonsState;
  let existingVirtualStudy = null;
  try {
    existingVirtualStudy = await getVirtualStudy(api)(virtualStudyId);
  } catch (err) {
    return Promise.reject(`Failed to update virtual study ${virtualStudyId}: ${err.message}`);
  }

  const updatedStudy = await api({
    method: 'PUT',
    url: urlJoin(shortUrlApi, virtualStudyId),
    body: JSON.stringify({
      alias: name || existingVirtualStudy.alias,
      sharedPublicly: existingVirtualStudy.sharedPublicly || false,
      content: {
        sqons: sqons || existingVirtualStudy.content.sqons,
        activeIndex: activeIndex || existingVirtualStudy.content.activeIndex,
        description: description,
      },
    }),
  });

  trackUserInteraction({
    category: TRACKING_EVENTS.categories.virtualStudies,
    action: TRACKING_EVENTS.actions.edit,
    label: JSON.stringify(updatedStudy),
  });

  const {
    data: {
      userUpdate: {
        record: { virtualStudies: updatedStudies },
      },
    },
  } = await updateStudiesInPersona(api, loggedInUser, updatedStudy);

  return [updatedStudy, updatedStudies];
};

export const deleteVirtualStudy = async ({ loggedInUser, api, name }) => {
  if (!name.length) {
    throw new Error('Study must have name');
  }
  const { egoId, _id: personaRecordId } = loggedInUser;
  const personaData = await getSavedVirtualStudyNames(api);
  await api({
    url: urlJoin(shortUrlApi, name),
    method: 'DELETE',
    body: JSON.stringify({
      userid: egoId,
    }),
  });
  const newVirtualStudies = personaData.data.self.virtualStudies.filter(function(obj) {
    return obj.id !== name;
  });
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

  // validate the virtual study to avoid bugs accross versions
  //  of the client that would be using different,
  //  incompatible formats to store the virtual studies
  return isValidStudy(virtualStudy) ? pick(virtualStudy, DRAFT_FIELDS) : null;
};

export const saveDraftVirtualStudy = virtualStudy => {
  localStorage.setItem(
    COHORT_BUILDER_DRAFT_LOCALSTORAGE_KEY,
    JSON.stringify(pick(virtualStudy, DRAFT_FIELDS)),
  );
};
