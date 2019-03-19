import urlJoin from 'url-join';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { personaApiRoot, shortUrlApi } from 'common/injectGlobals';

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
    throw 'Study must have name';
  }
  const { sqons, activeIndex } = sqonsState;
  const {
    data: {
      self: { virtualStudies: currentVirtualStudies },
    },
  } = await getSavedVirtualStudyNames(api);
  const { egoId } = loggedInUser;
  const { id } = await api({
    url: urlJoin(shortUrlApi, 'shorten'),
    body: JSON.stringify({
      userid: egoId,
      alias: 'test',
      sharedPublicly: false,
      content: {
        sqons,
        activeIndex,
        description,
      },
    }),
  });
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
  return id;
};

export const getVirtualStudy = api => async id => {
  const data = await api({
    method: 'GET',
    url: urlJoin(shortUrlApi, id),
  });
  return data;
};
