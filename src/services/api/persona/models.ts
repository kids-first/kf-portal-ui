export interface IPersonaUser {
  _id?: string;
  title?: string;
  firstName: string;
  lastName: string;
  egoId?: string;
  roles?: string[];
  acceptedTerms: boolean;
  email: string;
  institutionalEmail?: string;
  eraCommonsID?: string;
  department?: string;
  story?: string;
  bio?: string;
  jobTitle?: string;
  institution?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  phone?: string;
  website?: string;
  googleScholarId?: string;
  twitter?: string;
  facebook?: string;
  github?: string;
  linkedin?: string;
  orchid?: string;
  interests?: string[];
  acceptedKfOptIn?: boolean;
  acceptedNihOptIn?: boolean;
  acceptedDatasetSubscriptionKfOptIn?: boolean;
  isPublic?: boolean;
  isActive?: boolean;
  hashedEmail?: boolean;
}

export type TUserPersonaSubscribe = Pick<
  IPersonaUser,
  'firstName' | 'lastName' | 'email' | 'acceptedKfOptIn' | 'acceptedDatasetSubscriptionKfOptIn'
>;

export type TUserPersonaInsert = Omit<
  IPersonaUser,
  'id' | 'keycloak_id' | 'creation_date' | 'update_date'
>;
export type TPersonaUserUpdate = Partial<TUserPersonaInsert>;
