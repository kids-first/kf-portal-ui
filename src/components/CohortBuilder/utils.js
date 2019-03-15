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

export const createNewVirtualStudy = async ({ virtualStudy, loggedInUser, api, name }) => {
  const { sqons, activeIndex } = virtualStudy;
  const {
    data: {
      self: { virtualStudies: currentVirtualStudies },
    },
  } = await getSavedVirtualStudyNames(api);
  const egoId = (loggedInUser || {}).egoId;
  const { id } = await api({
    url: urlJoin(shortUrlApi, 'shorten'),
    body: JSON.stringify({
      userid: egoId,
      alias: 'test',
      sharedPublicly: false,
      content: {
        sqons,
        activeIndex,
      },
    }),
  });
  await api({
    url: urlJoin(personaApiRoot, 'graphql', 'PERSONA_UPDATE_VIRTUAL_STUDIES'),
    body: {
      variables: {
        virtualStudies: [...currentVirtualStudies, { id, name }],
        egoId,
      },
      query: print(gql`
        mutation($virtualStudies: [UserModelUserModelVirtualStudiesInput], $egoId: String) {
          userUpdate(
            record: {
              _id: "5c7480da9af7f706f2608d8c"
              egoId: $egoId
              firstName: "MINH"
              virtualStudies: $virtualStudies
            }
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
