export const TRACKING_EVENTS = {
  categories: {
    join: 'Join',
    signIn: 'Sign In',
    modals: 'Modals',
    charts: {
      donut: {
        _donut: 'Chart: Donut',
        userInterests: 'Chart: Donut: User Interests',
      },
      bar: {
        _bar: 'Chart: Bar:',
        studies: 'Chart: Bar: Studies',
        diagnoses: 'Chart: Bar: Most Frequent Diagnoses',
      },
    },
    user: {
      profile: 'User Profile',
      dashboard: {
        widgets: {
          authorizedStudies: 'Autohorized Studies',
          savedQueries: 'User Dashboard: Saved Queries widget',
          _card: 'User Dashboard: Card',
          _multiCard: 'User Dashboard: MultiCard',
        },
      },
    },
    entityPage: {
      file: 'Entity Page: File',
      participant: 'Entity Page: Participant',
    },
    cohortBuilder: {
      _cohortBuilder: 'Cohort Builder',
      results: {
        _cohortBuilderResults: 'Cohort Builder: Results',
        summaryView: 'Cohort Builder: Summary View',
        tableView: 'Cohort Builder: Table View',
      },
    },
    fileRepo: {
      filters: 'File Repo: Filters',
      dataTable: 'File Repo: Data Table',
      actionsSidebar: 'File Repo: Actions Sidebar',
    },
    cohortBuilder:{
      'sqonBuilder':"Cohort Builder: SQON Builder"
    },
    integration: {
      cavatica: 'Integration: Cavatica',
      gen3: 'Integration: Gen3',
      dcf: 'Integration: DCF',
    },
  },
  actions: {
    acceptedTerms: 'Accepted Terms',
    signedUp: 'Join Completed!',
    completedProfile: 'Completed Profile',
    open: 'Open',
    close: 'Close',
    hover: 'Hover',
    click: 'Clicked',
    edit: 'Edit',
    scroll: 'Scrolled',
    save: 'Save',
    filter: 'Filter',
    check: 'Check',
    uncheck: 'Uncheck',
    clear: 'Clear',
    delete: 'Delete',
    change: 'Change',
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
      disconnected: 'Integration Connection DISCONNECTED',
      failed: 'Integration Connection FAILED',
    },
  },
  labels: {
    joinProcess: 'Join Process',
    gen3: 'Gen3',
    dcf: 'DCF',
    cavatica: 'Cavatica',
  },
  timings: {
    modal: 'MODAL__',
    queryToDownload: 'FILE_QUERY_TO_DOWNLOAD',
    queryToCavatica: 'FILE_QUERY_TO_CAVATICA_COPY',
  },
};
