import ajax from 'services/ajax';
import urlJoin from 'url-join';
import { personaApiRoot } from 'common/injectGlobals';

const DEFAULT_FIELDS = `
  _id
  title
  firstName
  lastName
  egoId
  roles
  acceptedTerms
  email
  story
  bio
  jobTitle
  institution
  city
  state
  country
  website
  googleScholarId
  interests
  inactive
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

export const createProfile = async ({ egoId, lastName, firstName, email }) => {
  const { data: { data: { userCreate: { record } } } } = await ajax.post(
    urlJoin(personaApiRoot, 'graphql'),
    {
      variables: { egoId, lastName, firstName, email },
      query: `
        mutation($egoId: String, $firstName: String, $lastName: String, $email: String) {
          userCreate(record:{egoId: $egoId, firstName: $firstName, lastName: $lastName, email: $email}) {
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

export const getAllFieldNamesPromise = () => {
  return ajax.post(urlJoin(personaApiRoot, 'graphql'), {
    query: `
      query {
      __type(name: "UserModel") {
        fields {
          name
          type {
            name
          }
        }
      }
    }`,
  });
};
