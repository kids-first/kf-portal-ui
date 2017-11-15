import ajax from 'services/ajax';
import urlJoin from 'url-join';

const DEFAULT_FIELDS = `
  first_name
  last_name
  ego_id
  bio
  roles
  city
  _id
`;

export const getProfile = async ({ egoId }) => {
  const { data: { data: { users } } } = await ajax.post(
    urlJoin(process.env.REACT_APP_PROFILE_API, 'graphql'),
    {
      variables: { egoId },
      query: `
        query($egoId: String) {
          users(filter:{ego_id: $egoId}) {
            count
            items {
              ${DEFAULT_FIELDS}
            }
          }
        }
      `,
    },
  );

  if (users.count > 1) {
    console.warn(`egoId should only match 1 profile but ${egoId} matched ${users.mount} profiles`);
  }

  return users.items[0];
};

export const createProfile = async ({ egoId, last_name, first_name }) => {
  const { data: { data: { userCreate: { record } } } } = await ajax.post(
    urlJoin(process.env.REACT_APP_PROFILE_API, 'graphql'),
    {
      variables: { egoId, lastName: last_name, firstName: first_name },
      query: `
        mutation($egoId: String, $firstName: String, $lastName: String) {
          userCreate(record:{ego_id: $egoId, first_name: $firstName, last_name: $lastName}) {
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
    urlJoin(process.env.REACT_APP_PROFILE_API, 'graphql'),
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
