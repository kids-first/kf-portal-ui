import { IFileEntity, ITableFileEntity } from 'graphql/files/models';
import { ICavaticaBillingGroup, ICavaticaProject } from 'services/api/cavatica/models';

export type initialState = {
  isAnalyseModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  isCreatingProject: boolean;
  isFetchingBillingGroup: boolean;
  isInitializingAnalyse: boolean;
  isBulkImportLoading: boolean;
  isLoading: boolean;
  beginAnalyseAfterConnection: boolean;
  bulkImportData: IBulkImportData;
  projects: TCavaticaProjectWithMembers[];
  projectsTree: ICavaticaTreeNode[];
  billingGroups: ICavaticaBillingGroup[];
  error?: any;
  newlyCreatedProject?: ICavaticaTreeNode;
};

export interface IBulkImportData {
  files: IFileEntity[];
  authorizedFiles: IFileEntity[];
}

export type TCavaticaProjectWithMembers = ICavaticaProject & {
  memberCount: number;
};

export interface ICavaticaTreeNode {
  href: string;
  name: string;
  id: string;
  pId: any;
  value: string;
  title: string;
  type: string;
  project?: string;
  isLeaf?: boolean;
}
