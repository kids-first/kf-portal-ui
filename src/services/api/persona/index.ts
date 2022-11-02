import EnvironmentVariables from 'helpers/EnvVariables';
import { IPersonaUser, TPersonaUserUpdate } from './models';
import { sendRequest } from 'services/api';
import { omit } from 'lodash';

export const PERSONA_API_URL = `${EnvironmentVariables.configFor('PERSONA_API')}`;
export const MEMBER_API_URL = `${EnvironmentVariables.configFor('LEGACY_MEMBERS_API')}`;

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

const DEFAULT_FIELDS_OTHER_USER = `
  _id
  title
  firstName
  lastName
  roles
  acceptedTerms
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
  sets {
    name
    size
    type
    setId
  }
  hashedEmail
`;

export type TPersonaUserRequestPayload = {
  egoId?: string;
  lastName: string;
  firstName: string;
  email: string;
};

export const headers = {
  'Content-Type': 'application/json',
};

const fetch = () =>
  sendRequest<{
    data: {
      self: IPersonaUser;
    };
  }>({
    method: 'POST',
    url: `${PERSONA_API_URL}/graphql`,
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

const create = (user: IPersonaUser) =>
  sendRequest<{
    data: {
      userCreate: {
        record: IPersonaUser;
      };
    };
  }>({
    method: 'POST',
    url: `${PERSONA_API_URL}/graphql`,
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

const update = (user: TPersonaUserUpdate) =>
  sendRequest<{
    data: {
      userUpdate: {
        record: IPersonaUser;
      };
    };
  }>({
    method: 'POST',
    url: `${PERSONA_API_URL}/graphql`,
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

const fetchProfile = (id: string) =>
  sendRequest<{
    data: {
      user: IPersonaUser;
    };
  }>({
    method: 'POST',
    url: `${PERSONA_API_URL}/graphql`,
    headers,
    data: {
      variables: { _id: id },
      query: `
      query($_id: MongoID!){
        user(_id:$_id){
            ${DEFAULT_FIELDS_OTHER_USER}
        }
      }
      `,
    },
  });

const search = ({
  pageIndex = 0,
  pageSize = 15,
  match,
  roles,
  interests,
}: {
  pageIndex?: number;
  pageSize?: number;
  match?: string;
  sort?: string;
  roles?: string;
  interests?: string;
}) =>
  sendRequest<{
    publicMembers: IPersonaUser[];
    count: {
      public: number;
    };
  }>({
    method: 'GET',
    url: `${MEMBER_API_URL}/searchmembers`,
    headers,
    params: {
      queryString: match,
      start: pageIndex * pageSize,
      end: pageIndex * pageSize + pageSize,
      roles,
      interests,
    },
  });

export const PersonaApi = {
  fetch,
  fetchProfile,
  create,
  update,
  search,
};
