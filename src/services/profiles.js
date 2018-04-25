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
  sets {
    name
    size
    type
    setId
  }
`;

export const getProfile = api => async ({ egoId }) => {
  const body = {
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
  };
  const { data: { users } } = api
    ? await api({ url: urlJoin(personaApiRoot, 'graphql'), body })
    : await ajax.post(urlJoin(personaApiRoot, 'graphql'), body).then(data => data.data);

  if (users.count > 1) {
    console.warn(`egoId should only match 1 profile but ${egoId} matched ${users.mount} profiles`);
  }

  return users.items[0];
};

export const createProfile = api => async ({ egoId, lastName, firstName, email }) => {
  const body = {
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
  };

  const { data: { data: { userCreate: { record } } } } = api
    ? await api({ url: urlJoin(personaApiRoot, 'graphql'), body })
    : await ajax.post(urlJoin(personaApiRoot, 'graphql'), body);

  return record;
};

export const updateProfile = api => async ({ user }) => {
  console.log('api from updateProfile: ', api);
  const body = {
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
  };
  const { data: { userUpdate: { record } } } = api
    ? await api({ url: urlJoin(personaApiRoot, 'graphql'), body })
    : await ajax.post(urlJoin(personaApiRoot, 'graphql'), body).then(data => data.data);

  return record;
};

export const deleteProfile = api => async ({ user }) => {
  const body = {
    variables: { _id: user._id },
    query: `
      mutation($_id: MongoID!) {
        userRemove(_id: $_id) {
          recordId
        }
      }
    `,
  };
  const { data: { userRemove: { recordId } } } = api
    ? await api({ url: urlJoin(personaApiRoot, 'graphql'), body })
    : await ajax.post(urlJoin(personaApiRoot, 'graphql'), body).then(data => data.data);

  return recordId;
};

export const getAllFieldNamesPromise = api => {
  const body = {
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
  };
  return api
    ? api({ url: urlJoin(personaApiRoot, 'graphql'), body })
    : ajax.post(urlJoin(personaApiRoot, 'graphql'), body).then(({ data }) => data);
};
