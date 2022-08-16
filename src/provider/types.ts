export enum GraphqlBackend {
  FHIR,
  ARRANGER,
}

type ClinGraphqlProvider = {
  backend?: GraphqlBackend;
};

export interface IProvider {
  children: React.ReactNode;
}

export type GraphqlProvider = IProvider & ClinGraphqlProvider;
