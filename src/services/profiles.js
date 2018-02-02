import ajax from 'services/ajax';
import urlJoin from 'url-join';
import { personaApiRoot } from 'common/injectGlobals';

const DEFAULT_FIELDS = `
  firstName
  lastName
  egoId
  bio
  roles
  city
  _id
  acceptedTerms
`;

export const getProfile = async ({ egoId }) => {
  const { data: { data: { users } } } = await ajax.post(urlJoin(personaApiRoot, 'graphql'), {
    variables: { egoId },
    query: `
        query($egoId: String) {
          users(filter:{egoId: $egoId}) {
            count
            items {
              ${DEFAULT_FIELDS}
            }
          }
        }
      `,
  });

  if (users.count > 1) {
    console.warn(`egoId should only match 1 profile but ${egoId} matched ${users.mount} profiles`);
  }

  return users.items[0];
};

export const createProfile = async ({ egoId, lastName, firstName }) => {
  const { data: { data: { userCreate: { record } } } } = await ajax.post(
    urlJoin(personaApiRoot, 'graphql'),
    {
      variables: { egoId, lastName, firstName },
      query: `
        mutation($egoId: String, $firstName: String, $lastName: String) {
          userCreate(record:{egoId: $egoId, firstName: $firstName, lastName: $lastName}) {
            record {
              ${DEFAULT_FIELDS}
            }
          }
        }
      `,
    },
  );

  return record;
};

export const updateProfile = async ({ user }) => {
  const { data: { data: { userUpdate: { record } } } } = await ajax.post(
    urlJoin(personaApiRoot, 'graphql'),
    {
      variables: { record: user },
      query: `
        mutation($record: UpdateByIdUserModelInput!) {
          userUpdate(record: $record) {
            record {
              ${DEFAULT_FIELDS}
            }
          }
        }
      `,
    },
  );

  return record;
};

export const deleteProfile = async ({ user }) => {
  const { data: { data: { userRemove: { recordId } } } } = await ajax.post(
    urlJoin(personaApiRoot, 'graphql'),
    {
      variables: { _id: user._id },
      query: `
        mutation($_id: MongoID!) {
          userRemove(_id: $_id) {
            recordId
          }
        }
      `,
    },
  );

  return recordId;
};
