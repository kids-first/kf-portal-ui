export const TRACKING_EVENTS = {
  categories: {
    join: 'Join',
    signIn: 'Sign In',
    modals: 'Modals',
    user: {
      profile: 'User Profile',
      dashboard: {
        widgets: {
          savedQueries: 'User Dashboard: Saved Queries widget',
        },
      },
    },
    entityPage: {
      file: 'Entity Page: File',
      participant: 'Entity Page: Participant',
    },
    fileRepo: {
      filters: 'File Repo: Filters',
      dataTable: 'File Repo: Data Table',
      actionsSidebar: 'File Repo: Actions Sidebar',
    },
  },
  actions: {
    acceptedTerms: 'Accepted Terms',
    signedUp: 'Join Completed!',
    completedProfile: 'Completed Profile',
    open: 'Open',
    close: 'Close',
    click: 'Clicked',
    edit: 'Edit',
    scroll: 'Scrolled',
    save: 'Save',
    filter: 'Filter',
    copy: {
      toCavatica: 'Copied Files to Cavatica Project',
    },
    download: {
      manifest: 'Download Manifest',
      report: 'Download Report',
    },
    query: {
      save: 'Query Saved',
      share: 'Query Shared',
      clear: 'Clear Query (sqon)',
      delete: 'Query Deleted ',
    },
    userRoleSelected: 'User Role Updated',
    integration: {
      init: 'Integration Connection INIT',
      connected: 'Integration Connection SUCCESS',
      failed: 'Integration Connection FAILED',
    },
  },
  labels: {
    joinProcess: 'Join Process',
    gen3: 'Gen3',
    cavatica: 'Cavatica',
  },
  timings: {
    modal: 'MODAL__',
    queryToDownload: 'FILE_QUERY_TO_DOWNLOAD',
    queryToCavatica: 'FILE_QUERY_TO_CAVATICA_COPY',
  },
};
