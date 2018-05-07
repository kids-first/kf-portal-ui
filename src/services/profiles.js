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
  sets {
    name
    size
    type
    setId
  }
`;

export const getProfile = api => async ({ egoId }) => {
  const {
    data: { users },
  } = await api({
    url: urlJoin(personaApiRoot, 'graphql'),
    body: {
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
    },
  });

  if (users.count > 1) {
    console.warn(`egoId should only match 1 profile but ${egoId} matched ${users.mount} profiles`);
  }

  return users.items[0];
};

export const createProfile = api => async ({ egoId, lastName, firstName, email }) => {
  const {
    data: {
      userCreate: { record },
    },
  } = await api({
    url: urlJoin(personaApiRoot, 'graphql'),
    body: {
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
  });

  return record;
};

export const updateProfile = api => async ({ user }) => {
  const {
    data: {
      userUpdate: { record },
    },
  } = await api({
    url: urlJoin(personaApiRoot, 'graphql'),
    body: {
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
  });

  return record;
};

export const deleteProfile = api => async ({ user }) => {
  const {
    data: {
      userRemove: { recordId },
    },
  } = await api({
    url: urlJoin(personaApiRoot, 'graphql'),
    body: {
      variables: { _id: user._id },
      query: `
        mutation($_id: MongoID!) {
          userRemove(_id: $_id) {
            recordId
          }
        }
      `,
    },
  });

  return recordId;
};

export const getAllFieldNamesPromise = api => {
  return api({
    url: urlJoin(personaApiRoot, 'graphql'),
    body: {
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
    },
  });
};
