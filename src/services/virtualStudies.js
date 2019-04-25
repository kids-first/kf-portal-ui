import urlJoin from 'url-join';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { personaApiRoot, shortUrlApi } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

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
  const {
    data: {
      self: { virtualStudies: currentVirtualStudies },
    },
  } = await getSavedVirtualStudyNames(api);
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

  const { id } = newVirtualStudy;
  await api({
    url: urlJoin(personaApiRoot, 'graphql', 'PERSONA_UPDATE_VIRTUAL_STUDIES'),
    body: {
      variables: {
        egoId,
        virtualStudies: [...currentVirtualStudies, { id, name }],
        personaRecordId: loggedInUser._id,
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
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.virtualStudies,
    action: TRACKING_EVENTS.actions.save,
    label: JSON.stringify(newVirtualStudy),
  });
  return newVirtualStudy;
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

export const updateVirtualStudy = async ({ id, sqonsState, api, name, description }) => {
  const { sqons, activeIndex } = sqonsState;
  let existingVirtualStudy = null;
  try {
    existingVirtualStudy = await getVirtualStudy(api)(id);
  } catch (err) {
    return Promise.reject(`Failed to update virtual study ${id}: ${err.message}`);
  }

  const updatedStudy = await api({
    method: 'PUT',
    url: urlJoin(shortUrlApi, id),
    body: JSON.stringify({
      alias: name || existingVirtualStudy.alias,
      sharedPublicly: existingVirtualStudy.sharedPublicly,
      content: {
        sqons: sqons || existingVirtualStudy.content.sqons,
        activeIndex: activeIndex || existingVirtualStudy.content.activeIndex,
        description: description || existingVirtualStudy.content.description,
      },
    }),
  });

  trackUserInteraction({
    category: TRACKING_EVENTS.categories.virtualStudies,
    action: TRACKING_EVENTS.actions.edit,
    label: JSON.stringify(updatedStudy),
  });

  return updatedStudy;
};

export const deleteVirtualStudy = async ({ loggedInUser, api, name }) => {
  if (!name.length) {
    throw new Error('Study must have name');
  }
  const { egoId } = loggedInUser;
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
        personaRecordId: loggedInUser._id,
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
