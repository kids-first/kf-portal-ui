export enum CAVATICA_TYPE {
  PROJECT = 'project',
  FILE = 'file',
  FOLDER = 'folder',
}

export interface ICavaticaDRSImportJobPayload {
  href: string;
  id: string;
  result: any[];
  state: string;
}

export interface ICavaticaListPayload<T> {
  href: string;
  items: T[];
  links: any[];
}

export interface ICavaticaBillingGroup {
  id: string;
  href: string;
  name: string;
}

export interface ICavaticaCreateProjectBody {
  name: string;
  billing_group: string;
}

export interface ICavaticaProjectNode {
  href: string;
  id: string;
  name: string;
  //project: string;
  //parent: string;
  type: string;
}

export interface ICavaticaProject {
  href: string;
  id: string;
  name: string;
  category: string;
  created_by: string;
  created_on: string;
  modified_on: string;
}

export interface ICavaticaProjectMember {
  href: string;
  username: string;
  permissions: {
    write: true;
    read: true;
    copy: true;
    execute: true;
    admin: true;
  };
}

/**
 * Should not be used together with project.
 * If parent is used, the import will take place into the specified folder,
 * within the project to which the folder belongs. If project is used,
 * the items will be imported to the root of the project's files.
 */
export interface ICavaticaDRSImportItem {
  drs_uri: string;
  project?: string;
  parent?: string;
  name?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface ICavaticaDRSImportBody {
  conflict_resolution?: 'OVERWRITE' | 'RENAME' | 'SKIP';
  items: ICavaticaDRSImportItem[];
  tags?: string[];
}
