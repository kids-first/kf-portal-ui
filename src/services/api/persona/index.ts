import EnvironmentVariables from 'helpers/EnvVariables';
import { TPersonaUser, TPersonaUserCreate, TPersonaUserFetch, TPersonaUserUpdate } from './models';
import { sendRequest } from 'services/api';
import { omit } from 'lodash';

export const PERSONA_API_URL = `${EnvironmentVariables.configFor('PERSONA_API')}`;

const DEFAULT_FIELDS_SELF = `
  _id
  title
  firstName
  lastName
  egoId
  roles
  acceptedTerms
  email
  institutionalEmail
  eraCommonsID
  department
  story
  bio
  jobTitle
  institution
  addressLine1
  addressLine2
  city
  state
  country
  zip
  phone
  website
  googleScholarId
  twitter
  facebook
  github
  linkedin
  orchid
  interests
  acceptedKfOptIn
  acceptedNihOptIn
  acceptedDatasetSubscriptionKfOptIn
  isPublic
  isActive
  hashedEmail
`;

export const headers = {
  'Content-Type': 'application/json',
};

const fetch = () =>
  sendRequest<TPersonaUserFetch>({
    method: 'POST',
    url: `${PERSONA_API_URL}graphql`,
    headers,
    data: {
      query: `
        query {
          self {
            ${DEFAULT_FIELDS_SELF}
          }
        }
      `,
    },
  });

export type TPersonaUserRequestPayload = {
  egoId?: string;
  lastName: string;
  firstName: string;
  email: string;
};

const create = (user: TPersonaUser) => {
  return sendRequest<TPersonaUserCreate>({
    method: 'POST',
    url: `${PERSONA_API_URL}graphql`,
    headers,
    data: {
      variables: user,
      query: `
        mutation($egoId: String!, $firstName: String, $lastName: String, $email: String, $acceptedTerms: Boolean, $acceptedKfOptIn: Boolean, $acceptedDatasetSubscriptionKfOptIn: Boolean) {
          userCreate(record:{egoId: $egoId, firstName: $firstName, lastName: $lastName, email: $email, acceptedTerms: $acceptedTerms, acceptedKfOptIn: $acceptedKfOptIn, acceptedDatasetSubscriptionKfOptIn: $acceptedDatasetSubscriptionKfOptIn}) {
            record {
              ${DEFAULT_FIELDS_SELF}
            }
          }
        }
      `,
    },
  });
};

const update = (user: TPersonaUserUpdate) => {
  return sendRequest<TPersonaUser>({
    method: 'POST',
    url: `${PERSONA_API_URL}graphql`,
    headers,
    data: {
      variables: { _id: user._id, record: omit(user, ['_id', 'groups', 'isAdmin']) },
      query: `
        mutation($_id: MongoID!, $record: UpdateByIdUserModelInput!) {
          userUpdate(_id: $_id, record: $record) {
            record {
              ${DEFAULT_FIELDS_SELF}
            }
          }
        }
      `,
    },
  });
};

export const PersonaApi = {
  fetch,
  create,
  update,
};
