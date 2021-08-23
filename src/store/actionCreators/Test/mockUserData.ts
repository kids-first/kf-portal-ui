import { RawUser } from 'store/userTypes';

export const MOCK_USER_1_NOT_ADMIN: RawUser = {
  _id: '12345',
  roles: ['researcher'],
  egoId: 'xyz',
  acceptedDatasetSubscriptionKfOptIn: false,
  acceptedKfOptIn: false,
  acceptedNihOptIn: false,
  acceptedTerms: false,
  email: 'myemail@abc.com',
  firstName: 'John',
  lastName: 'Doe',
  isPublic: true,
};

export const MOCK_USER_2_ADMIN: RawUser = {
  _id: '84738',
  roles: ['researcher', 'ADMIN'],
  egoId: 'abc',
  acceptedDatasetSubscriptionKfOptIn: false,
  acceptedKfOptIn: false,
  acceptedNihOptIn: false,
  acceptedTerms: false,
  email: 'myemail2@abc.com',
  firstName: 'Johnny',
  lastName: 'Hill',
  isPublic: false,
};
