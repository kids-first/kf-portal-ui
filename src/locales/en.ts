/* eslint-disable max-len */
import translations from './en.json';

const filesFacets = {
  data_category: 'Data Category',
  data_access: 'Data Access',
  data_type: 'Data Type',
  file_format: 'File Format',
  size: 'Size',
  access: 'Access',
  controlled_access: 'Access',
  sequencing_experiment: {
    experiment_strategy: 'Experimental Strategy',
    platform: 'Platform',
    instrument_model: 'Instrument Model',
    library_strand: 'Library Strand',
    is_paired_end: 'Is Paired End',
  },
  is_harmonized: 'Harmonized Data',
  acl: 'ACL',
};

const en = {
  ...translations,
  date: {
    years: '{years, plural, =0 {} =1 {year} other {years}}',
    days: '{days, plural, =0 {} =1 {day} other {days}}',
  },
  global: {
    viewInExploration: 'View in exploration',
    yes: 'Yes',
    no: 'No',
    connect: 'Connect',
    close: 'Close',
    search: {
      genes: {
        emptyText: 'No gene found',
        placeholder: 'e.g. BRAF, ENSG00000157764',
        title: 'Search by gene',
        tooltip: 'Enter a Gene Symbol, Gene Alias ​​or Ensembl ID',
      },
      variants: {
        emptyText: 'No variant found',
        placeholder: 'e.g. 10-100063679-C-T, rs341',
        title: 'Search by variant',
        tooltip:
          'Enter Variant Locus, Gene Symbol, Gene Alias, Gene AA Change, dbSNP ID, Clinvar ID, Ensembl ID, refseq ID',
      },
      study: {
        emptyText: 'No study found',
        placeholder: 'e.g. KF DSD, Neuroblastoma',
        title: 'Search by study',
        tooltip: 'Search by Study Code, Study Name, dbGaP Accession Number',
      },
      participant: {
        emptyText: 'No participants found',
        placeholder: 'e.g. PT_1BCRHQVF, HTP0001, FM_012SFG34',
        title: 'Search by Participant ID',
        tooltip: 'Search by Participant ID, External Participant ID or Family ID',
      },
      biospecimen: {
        emptyText: 'No samples found',
        placeholder: 'e.g. BS_011DYZ2J, HTP0001B2_Plasma, SSH3953290',
        title: 'Search by Sample ID',
        tooltip: 'Search by Sample ID or External Sample ID',
        collection: {
          emptyText: 'No collection ID found',
          placeholder: 'e.g. HTP0001B2_Whole blood, BS_1YEZ2XR4_Saliva',
          title: 'Search by Collection ID',
        },
      },
      file: {
        emptyText: 'No files found',
        placeholder: 'e.g. GF_001CSF26',
        title: 'Search by File ID',
      },
    },
    filters: {
      actions: {
        all: 'All',
        none: 'None',
        clear: 'Clear',
        less: 'Less',
        more: 'More',
        apply: 'Apply',
        dictionary: 'Dictionary',
      },
      operators: {
        between: 'Between',
        lessthan: 'Less than',
        lessthanorequal: 'Less than or equal',
        greaterthan: 'Greater than',
        greaterthanorequal: 'Greater than or equal',
      },
      range: {
        is: 'Is',
      },
      messages: {
        empty: 'No values found',
      },
      checkbox: {
        placeholder: 'Search...',
      },
    },
    forms: {
      errors: {
        minCharacters: 'characters minimum',
        requiredField: 'This field is required',
        enterValidEmail: 'Enter a valid email',
      },
    },
    errors: {
      403: 'Sorry, you are not authorized to access this page.',
      404: 'Sorry, the page you visited does not exist.',
      500: 'Sorry, something went wrong.',
      backHome: 'Back home',
    },
    notification: {
      genericError: 'An error occured',
    },
    proTable: {
      clear: 'Clear',
      clearFilters: 'Clear filters',
      noResults: 'No Results',
      of: 'of',
      pagination: {
        first: 'First',
        previous: 'Prev.',
        next: 'Next',
        view: '{value} / view',
      },
      result: 'Result',
      results: 'Results',
      selectAll: 'Select all results',
      selected: 'item selected',
      selectedPlural: 'items selected',
    },
    quickFilter: {
      apply: 'Apply',
      cancel: 'Cancel',
      emptyMessage: 'Min. 3 characters',
      menuTitle: 'Quick filter',
      placeholder: 'Search...',
      results: 'Results',
    },
  },
  maintenance: {
    title: 'We are currently down for maintenance',
    subtitle:
      'We apologize for any inconvenience and appreciate your understanding while we work to bring the portal back online.',
  },
  api: {
    savedFilter: {
      error: {
        title: 'Error',
        messageUpdate: 'Unable to update filter',
        messageDelete: 'Unable to delete filter',
      },
    },
    savedSet: {
      error: {
        title: 'Error',
        messageUpdate: 'Unable to update set',
        messageDelete: 'Unable to delete set',
        messageCreate: 'Unable to create set',
      },
      success: {
        titleCreate: 'Your set has been saved.',
        messageCreate: 'You can add your sets to a query from the sidebar or the dashboard.',
        titleUpdate: 'Success',
        messageUpdate: 'Your set has been updated.',
      },
    },
    cavatica: {
      error: {
        title: 'Error',
        projects: {
          fetch: 'Unable to fetch your cavatica projects.',
          create: 'Unable to create your cavatica project.',
        },
        billingGroups: {
          title: 'Unable to fetch your cavatica billing groups',
          fetch:
            'We are currently unable to connect to this service. Please refresh the page and try again. If the problem persists, please',
        },
        bulk: {
          import: 'Unable to copy files to your project',
          fetchFiles: 'Unable to fetch selected files',
        },
        fileAuth: {
          title: 'Unauthorized files',
          description:
            'You are not authorized to analyze the files you have selected. Learn more about <a href="https://d3b.notion.site/Studies-and-Access-a5d2f55a8b40461eac5bf32d9483e90f" rel="noreferrer" style="color:unset;text-decoration:underline;" target="_blank">data access</a>.',
        },
      },
      success: {
        title: 'Success',
        description: `<div><p>Your files have been copied to: <strong>{destination}</strong></p>
          <p>If you have uploaded more than 10000 files in the last 5 minutes, the import may take a little longer.</p>
          <a href="{userBaseUrl}" rel="noreferrer" style="color:unset;text-decoration:underline;" target="_blank">Open project in Cavatica</a><div>`,
        projects: {
          create: 'Project created successfully',
        },
        bulk: {
          import: {
            copySuccess: 'Your files have been copied to: <strong>{destination}</strong>',
            possibleDelays:
              'If you have uploaded more than 10000 files in the last 5 minutes, the import may take a little longer.',
            openProject: 'Open project in Cavatica',
          },
        },
      },
    },
    report: {
      clinicalData: {
        download: 'Download clinical data',
        family:
          '{count, plural, =0 {Selected participant & family} =1 {Selected participant & family} other {Selected participants & families}}',
        participant:
          '{count, plural, =0 {Selected participant} =1 {Selected participant} other {Selected participants}}',
      },
      error: {
        title: 'Error',
        message: 'We were unable to generate the report at this time. Please try again later or ',
        support: 'contact support',
        tooMuchFilesTitle: 'Maximum number exceeded',
        tooMuchFiles:
          'A maximum of 10,000 files can be inlcuded at a time. Please narrow your selection and try again.',
      },
      inProgress: {
        title: 'Processing',
        fetchReport: 'Fetching Report, please wait',
      },
      onSuccess: {
        title: 'Success',
        fetchReport: 'Report downloaded successfully',
      },
      fileManifest: {
        button: 'Manifest',
        title: 'File manifest',
        okText: 'Download',
        cancel: 'Cancel',
        text: `Download a manifest of the selected files which can be used for bulk downloading using Cavatica’s <a target="_blank" href="https://docs.cavatica.org/docs/import-from-a-drs-server" style="text-decoration: underline;">Import from an GA4GH Data Repository Service (DRS)</a>. This manifest also includes additional information, including the participant and samples associated with these files.`,
        textCheckbox: `Include data files of the same type for the participants' related family members for this selection.`,
        summary: 'Summary',
      },
    },
    noData: 'No data',
  },
  components: {
    filterList: {
      collapseAll: 'Collapse all',
      expandAll: 'Expand all',
    },
    table: {
      itemCount: {
        singlePage: '{count, plural, =0 {No result} other {<strong>#</strong> results}}',
        multiplePages:
          'Results <strong>{from}</strong> - <strong>{to}</strong> of <strong>{total}</strong>',
      },
    },
    suggester: {
      error: {
        title: 'Error',
        description: 'An error occurred while fetching suggestions',
      },
      noResultsFound: 'No results found',
    },
    querybuilder: {
      defaultTitle: 'Untitled Filter',
      header: {
        modal: {
          edit: {
            title: 'Edit filter',
            okText: 'Save',
            cancelText: 'Cancel',
            input: {
              label: 'Filter name',
              placeholder: 'Untitled filter',
              maximumLength: 'characters maximum',
            },
          },
          confirmUnsaved: {
            title: 'Unsaved changes',
            openSavedFilter: {
              okText: 'Continue',
              cancelText: 'Cancel',
              content: 'You are about to open a saved filter; all modifications will be lost.',
            },
            createNewFilter: {
              okText: 'Create',
              cancelText: 'Cancel',
              content: 'You are about to create a new filter; all modifications will be lost.',
            },
          },
        },
        popupConfirm: {
          delete: {
            title: 'Permanently delete this filter?',
            okText: 'Delete filter',
            cancelText: 'Cancel',
            content: 'You are about to permanently delete this filter and all of its queries.',
          },
        },
        tooltips: {
          newQueryBuilder: 'New filter',
          save: 'Save filter',
          saveChanges: 'Save changes',
          saveDisabled: 'Add a query to save',
          delete: 'Delete',
          duplicateQueryBuilder: 'Duplicate filter',
          share: 'Share (Copy url)',
          shareDisabled: 'Save filter to share',
          setAsDefaultFilter: 'Set as default filter',
          unsetDefaultFilter: 'Unset default filter',
          undoChanges: 'Discard unsaved changes',
          noSavedFilters: 'You have no saved filters',
        },
        myFiltersDropdown: {
          title: 'My Filters',
          manageMyFilter: 'Manage filters',
        },
        duplicateFilterTitleSuffix: 'COPY',
      },
      query: {
        combine: {
          and: 'and',
          or: 'or',
        },
        noQuery: 'Use the search tools & facets on the left to build a query',
      },
      actions: {
        new: 'New',
        changeOperatorTo: 'Change operator to',
        addQuery: 'New query',
        combine: 'Combine',
        labels: 'Labels',
        delete: {
          title: 'Delete this query?',
          titleSelected: 'Delete this query?',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        clear: {
          title: 'Delete all queries?',
          cancel: 'Cancel',
          confirm: 'Delete',
          buttonTitle: 'Clear all',
          description: 'You are about to delete all your queries. They will be lost forever.',
        },
      },
    },
    savedSets: {
      modal: {
        edit: {
          title: 'Edit set',
          okText: 'Save',
          label: '{type} set',
          cancelText: 'Cancel',
          input: {
            label: 'Set name',
            placeholder: 'Untitled Set',
            maximumLength: 'characters maximum',
          },
        },
        add: {
          title: 'Add to a {type} set',
          okText: 'Add to set',
          name: 'Set name',
          cancelText: 'Cancel',
        },
        remove: {
          title: 'Remove from a {type} set',
          okText: 'Remove from set',
          cancelText: 'Cancel',
        },
      },
      popupConfirm: {
        delete: {
          title: 'Permanently delete this set?',
          okText: 'Delete set',
          cancelText: 'Cancel',
          content: 'You are about to permanently delete this set.',
        },
      },
    },
    dataRelease: {
      studies: 'Studies',
      participants: 'Participants',
      biospecimens: 'Biospecimens',
      families: 'Families',
      storage: 'Storage',
      files: 'Data Files',
    },
    uploadIds: {
      modal: {
        title: 'Upload a {entity} list',
        submittedColTitle: 'Submitted {entity} identifiers',
        uploadBtnText: 'Upload a {entity} list',
        mappedTo: 'Mapped To',
        collapseTitle: 'Summary Table  ({matchCount} matched, {unMatchCount} unmatched)',
        inputLabel: 'Copy-paste a list of identifiers or upload a file',
        match: 'Matched ({count})',
        unmatch: 'Unmatched ({count})',
        identifiers: {
          participant: 'Participant ID, External Participant ID, Family ID',
          biospecimen: 'Sample ID, External Sample ID',
          file: 'File ID',
        },
        placeholders: {
          participant: 'e.g. PT_03Y3K025, HTP0001, 10214, FM_012SFG34',
          biospecimen: 'e.g. HTP0001B2_Whole blood, BS_011DYZ2J_DNA, 238981007, SSH3953290',
          file: 'e.g. GF_2JAYWYDX, GF_TP6PG8Z0',
        },
        tableMessage:
          '{submittedCount} submitted identifiers mapped to {mappedCount} unique system identifiers',
        matchTable: {
          idcol: '{entity} ID',
          participant: {
            matchcol: 'Participant ID',
            mappedcol: 'Study',
          },
          file: {
            matchcol: 'File ID',
            mappedcol: 'Study',
          },
          biospecimen: {
            matchcol: 'Sample ID',
            mappedcol: 'Study',
          },
        },
        pillTitle: 'Uploaded List',
        upload: {
          fileBtn: 'Upload a file',
          btn: 'Upload',
        },
        clearBtn: 'Clear',
        cancelBtn: 'Cancel',
        emptyTable: 'No data',
        popover: {
          title: 'Identifiers and File Formats',
          identifiers: 'Identifiers',
          separatedBy: {
            title: 'Separated by',
            values: 'comma, space, new line',
          },
          fileFormats: '.txt, .csv, .tsv',
          uploadFileFormats: 'Upload file formats',
        },
      },
    },
  },
  layout: {
    main: {
      menu: {
        biospecimen: 'Biospecimen',
        community: 'Community',
        contact: 'Contact',
        dashboard: 'Dashboard',
        datafiles: 'Data Files',
        documentation: 'Documentation',
        explore: 'Data Exploration',
        help: 'Help',
        participants: 'Participants',
        studies: 'Studies',
        variants: 'Variants',
        website: 'Website',
      },
    },
    user: {
      menu: {
        myprofile: 'My Profile',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
  },
  screen: {
    participantEntity: {
      proband: 'Proband',
      familyMember: 'Family Member',
      downloadData: 'Download clinical data',
      summaryHeader: {
        studies: '{count, plural, =0 {Study} =1 {Study} other {Studies}}',
        files: '{count, plural, =0 {File} =1 {File} other {Files}}',
      },
      summary: {
        title: 'Summary',
        id: 'ID',
        externalId: 'Ext. Participant ID',
        externalIdTooltips: 'External participant ID',
        study: 'Study',
        dbGaP: 'dbGaP',
        pedcBioPortal: 'PedcBioPortal',
        diagnosisCategory: 'Diagnosis Category',
        familyComposition: 'Family Composition',
        proband: 'Proband',
        vitalStatus: 'Vital Status',
      },
      profile: {
        title: 'Profile',
        race: 'Race',
        ethnicity: 'Ethnicity',
        sex: 'Sex',
        vitalStatus: 'Vital Status',
        deceased_date: 'Age at death',
      },
      family: {
        title: 'Family',
        id: 'Participant ID',
        affectedStatus: 'Affected Status',
        relationship: 'Family Relationship',
      },
      diagnosis: {
        title: 'Diagnosis',
        age: {
          title: 'Age',
          tooltip: 'Age at Diagnosis',
        },
        category: 'Diagnosis Category',
        sourceText: 'Diagnosis (Source Text)',
        sharedTerm: 'MONDO Shared Term',
        sharedTermTooltip: '# of participants with this exact MONDO term',
        ncit: 'Diagnosis (NCIT)',
        mondo: 'Diagnosis (MONDO)',
      },
      phenotype: {
        title: 'Phenotype',
        hpoPhenotypeObserved: 'Phenotype (HPO)',
        sourceText: 'Phenotype (Source Text)',
        age: {
          title: 'Age',
          tooltip: 'Age at Phenotype',
        },
        interpretation: 'Interpretation',
        sharedTerm: 'HPO Term',
      },
      biospecimen: {
        title: 'Biospecimen',
      },
      files: {
        title: 'Data File',
        files: 'Files',
        dataFile: 'Data File',
        dataType: 'Data Type',
        numberByDataTypes: 'File counts by Data Type',
        numberByDataTypesTooltip: 'Total number of files associated with the participant',
        totalNumberOfFiles: '(n={count})',
        numberByExperimentalStrategy: 'File counts by Experimental Strategy',
        sequencing_experiment: {
          experimental_strategy: 'Experimental Strategy',
          type_of_sequencing: 'Sequencing Type',
          read_length: 'Read Length',
          platform: 'Platform',
          capture_kit: 'Capture Kit',
          sequencer_id: 'Sequencer',
          run_date: 'Date (yyyy-mm-dd)',
          run_name: 'Run',
          labAliquotID: 'Aliquot',
          bio_informatic_analysis: 'ID',
          workflow_name: 'Pipeline',
          workflow_version: 'Version',
          genome_build: 'Genome Build',
          analysis_id: 'Analysis ID',
        },
      },
    },
    memberProfile: {
      notFound: 'User not found',
      rolesTitle: 'Role',
      noRoles: 'No roles',
      interests: 'Area of interest',
      noUsage: 'No intended usages',
      editProfileBtn: 'Edit Profile',
      communityBtn: 'Community',
      privateAlert:
        'Your profile is currently hidden from community members. You can make it public in the ',
      settingsPage: 'settings page',
    },
    loginPage: {
      title: 'Kids First Data Resource Portal',
      datarelease: {
        title: 'Available Data',
      },
      accelerating:
        'Accelerating research and promoting new discoveries for children affected with cancer and structural birth defects.',
      accessLargeScale:
        'Data from over {count} samples, including whole genome sequencing (WGS) and RNA-Sequencing, is available to empower your research today.',
      login: 'Login',
      signup: 'Sign up',
    },
    dashboard: {
      hello: 'Hello',
      links: {
        studies: 'Studies',
        participants: 'Participants',
        biospecimens: 'Biospecimens',
        datafiles: 'Data Files',
        variantSearch: 'Variant Search',
      },
      cards: {
        infoPopover: {
          and: ' and ',
          variantsLink: 'Variants Exploration',
          dataExploLink: 'Data Exploration',
          pages: ' pages.',
        },
        error: {
          title: 'Connection error',
          disconnect: {
            start: 'We are currently unable to connect to this service. Please refresh the page or',
            end: 'your account and try again. If the problem persists, please',
          },
          subtitle:
            'We are currently unable to connect to this service. Please refresh the page and try again. If the problem persists, please',
          contactSupport: 'contact support',
        },
        datarelease: {
          title: 'Data release {version}',
        },
        authorizedStudies: {
          title: 'Authorized Studies {count, plural, =0 {} other {(#)}}',
          connectedNotice: 'You have access to the following Kids First controlled data. ',
          disconnectedNotice:
            'To access controlled study files, connect to our data repository partners using your NIH credentials.',
          disconnect: 'Disconnect',
          manageConnections: 'Manage your connections',
          noAvailableStudies: 'No available studies',
          authorization: 'Authorization : ',
          of: 'of',
          files: 'Files',
          dataGroups: 'Data use groups: ',
          modal: {
            title: 'Manage Connections',
            error: 'We were unable to establish a connection. Please try again later.',
            description:
              'Access select NCI and Kids First controlled access data by connecting your account using your NIH login credentials. Please remember that it is your responsibility to follow any data use limitations with controlled access data.',
          },
          notification: {
            message: 'Error Connecting',
            description:
              'An error occurred while connecting to the data repository. Please, try again or contact our support.',
          },
          infoPopover: {
            title: 'Accessing Data',
            content:
              'Users requesting access to controlled data are required to have an eRA Commons account. Read more on',
            applyingForDataAccess: 'applying for data access',
          },
        },
        cavatica: {
          title: 'Cavatica Projects',
          connectedNotice: 'You are connected to the Cavatica cloud environment.',
          disconnectedNotice: 'To analyze KIDS FIRST data on the cloud, connect to Cavatica.',
          disconnect: 'Disconnect',
          noProjects: 'You do not have any Cavatica projects.',
          createNewProject: 'Create your first project',
          membersCount: '{count, plural, =0 {# member} =1 {# member} other {# members}}',
          infoPopover: {
            title: 'CAVATICA Compute Cloud Platform',
            content:
              'CAVATICA is a cloud-based data analysis platform where data, results, and workflows are shared among the world’s research community.',
            readMore: 'Read more',
          },
          newProject: 'New project',
          billingGroups: {
            label: 'Project billing group',
            empty: 'You have no project billing group',
          },
          createProject: 'Create project',
          cancelText: 'Cancel',
          error: {
            create: {
              title: 'Unable to create project',
              subtitle:
                'An error has occurred and we were unable to create your project. Please try again or',
            },
          },
        },
        savedFilters: {
          errorCard: {
            failedToFetch: 'Failed to Fetch Saved Filters',
            message:
              'Please refresh and try again or <a href="{href}" style="color:inherit;text-decoration: underline;">contact our support</a>.',
          },
          title: 'Saved Filters',
          noSavedFilters:
            'A saved filter is a virtual query created by applying one or more filters to a data set. Save your first filter from the query builder at the top of the ',
          lastSaved: 'Last saved: {date} ago',
          infoPopover: {
            content:
              'A saved filter is a virtual query created by applying one or more filters to a data set. They can be saved and revisited for later use. You can create and manage saved filters from the query builder at the top of the ',
            title: 'Managing Saved Filters',
          },
        },
        savedSets: {
          errorCard: {
            failedToFetch: 'Failed to fetch Saved Sets',
            message:
              'Please refresh and try again or <a href="{href}" style="color:inherit;text-decoration: underline;">contact our support</a>.',
          },
          tabs: {
            biospecimens: 'Biospecimens',
            files: 'Files',
            participants: 'Participants',
            variants: 'Variants',
          },
          title: 'Saved Sets',
          noSavedSets:
            'A saved set is a collection of one or more entity IDs which can be saved and revisited for later use. Save your first set at the top of the table of results in the ',
          lastSaved: 'Last saved: {date} ago',
          infoPopover: {
            content:
              'A saved set is a collection of one or more entity IDs which can be saved and revisited for later use. You can create saved sets at the top of the table of results in the ',
            title: 'Managing Saved Sets',
          },
        },
        notebook: {
          title: 'Variant Workbench',
          dataStudio: 'Data Studio',
          tooltip: {
            title: 'CAVATICA VWB — Data Studio',
            part1: 'Analyze Kids First’s variant data in Cavatica’s',
            part2:
              'for enhanced data manipulation. Once your files are copied into a Cavatica project, you can explore and combine Kids First participant clinical data, variant annotations, and public external variant databases (such as Ensembl, gnomAD, dbNSFP, OMIM) in JupyterLab with PySpark to conduct statistical analyses, integrate multi-omics data, generate predictive models, and create compelling visualizations.',
            part3:
              'In order to access and copy variant data in a Cavatica project, you must have authorizations to access select NCI and Kids First controlled data. Connect to our data repository partners using your eRA Commons account to obtain controlled access to variant data.',
            readMore: 'Read more on',
            applyingForDataAccess: 'applying for data access',
          },
          account: 'Account Settings',
          firstConnectError:
            'In order to lauch your notebook, you must first connect to your data repositories in your',
          description: {
            part1:
              'Access the Kids First variant database within your own high-performance compute environment using Cavatica’s',
            part2: 'and combine participant clinical data with variant annotations.',
          },
          contactSupport:
            'We were unable to complete this operation. <a href="mailto:support@kidsfirstdrc.org">Contact support</a> if the issue persists',
          tryAgain: 'Try Again',
          notAllowed: 'Currently available for Kids First investigators only.',
          wait: 'This process may take a few moments.',
          open: 'Open notebooks',
          launch: 'Launch in Cavatica',
          error: {
            title: 'Error',
            no_fence_connection: {
              title: 'Connection Error',
              description: `We couldn't establish a connection to the data repository partners. Please use your eRA Commons account to connect through the Authorized Studies widget.`,
            },
            no_acl: {
              title: 'Access denied: insufficient permissions',
              description:
                'You do not have the necessary permissions to access this controlled data. Please try again or <a href="mailto:support@kidsfirstdrc.org">Contact support</a>.',
            },
            no_file_for_acls: {
              title: 'No variant data available',
              description: 'No variant data was found for your permitted controlled access list.',
            },
          },
        },
        fhirDataResource: {
          title: 'Kids First FHIR API',
          infoPopover: {
            title: 'Query KF Data via FHIR API',
            content:
              'The HL7® FHIR® format defines how clinical health data for research can be made interoperable across different computer systems via an API regardless of how it is stored in those systems. The NIH encourages biomedical investigators to use the FHIR standard to support exchange of data between NCPI’s participating platforms.',
            readMore: 'Read more',
          },
          caringApi: {
            title: '<i>CARING</i> Data FHIR API Endpoint',
            description: 'Query the entire CARING dataset via FHIR API parameters',
            popoverText:
              "FHIR & Data Resources for NIH's Collaboration to Assess Risk and Identify LoNG-term outcomes for Children with COVID",
          },
          kfApi: {
            title: 'Kids First FHIR API Endpoint',
            description: 'Query all released Kids First datasets via FHIR API',
          },
          dashboardApi: {
            title: 'Kids First FHIR Data Dashboard',
            description: 'Explore the CARING data via dashboard interfaces',
          },
          documentation: {
            title: 'Kids First FHIR Documentation',
            description: 'Swagger documentation to learn how to interact with the FHIR API',
          },
        },
      },
    },
    community: {
      title: 'Kids First Community',
      result: 'Public Member',
      results: 'Public Members',
      noResults: 'No Public members',
      totalMembers: 'Total Members',
      search: {
        filters: 'Filters',
        selectPlaceholder: 'Select',
        role: 'Member Role',
        interests: 'Area of interest',
        clearFilters: 'Clear filters',
        barPlaceholder: 'Search by member name or affiliation',
        sorter: {
          newest: 'Newest first',
          oldest: 'Oldest first',
          lastnameAlpha: 'Alphabetical (last name)',
        },
      },
    },
    profileSettings: {
      title: 'Profile settings',
      viewProfile: 'View profile',
      toggleProfileVisibility: {
        title: 'Public Profile',
        tooltip:
          'When your profile is public, other members can see information about you that includes your name, role, affiliation, and research interest.',
      },
      cards: {
        deleteAccount: {
          title: 'Delete Account',
          button: 'Delete my account',
          notice:
            'You will no longer be able to sign into the Kids First data portal. All of your saved sets and queries will be lost. You can create a new account at any time.',
          confirm: {
            content: 'Are you sure you want to permanently delete this account?',
          },
        },
        identification: {
          title: 'Identification',
          alert:
            'You are authenticated with <strong>{provider}</strong> using <strong>{email}</strong>. This {id} is never shown to the public and cannot be changed.',
          firstName: 'First Name',
          yourFirstName: 'Your First Name',
          lastName: 'Last Name',
          yourLastName: 'Your Last Name',
          website: 'Website',
          editPhotoModalTitle: 'Edit photo',
          uploadImageError: 'Unable to upload your image at the moment',
          removePhotoModalTitle: 'Remove profile photo?',
          removePhotoModalButton: 'Yes remove photo',
          removePhotoModalMessage:
            'Are you sure you want to remove your photo? We will replace it with a default avatar.',
          uploadPhotoButton: 'Upload photo',
          removePhotoButton: 'Remove photo',
        },
        roleAffiliation: {
          title: 'Role & Affiliation',
          role: 'Role',
          checkAllThatApply: 'Check all that apply',
          institution: 'Institution or organization',
          institutionalEmail: 'Institutional email address',
          institutionalEmailTooltip:
            'This email will be displayed on your profile page and accessible to all logged-in users of the portal.',
        },
        location: {
          title: 'Location',
          adressLine1: 'Adress Line 1',
          adressLine2: 'Adress Line 2',
          city: 'City',
          state: 'State or province',
          country: 'Country',
          zip: 'Zip',
        },
        researchInterests: {
          title: 'Research Interest',
          interests: 'Area of interest',
        },
        saveChanges: 'Save changes',
        discardChanges: 'Discard changes',
      },
    },
    variants: {
      sidemenu: {
        participant: 'Participant',
        variant: 'Variant',
        gene: 'Gene',
        frequency: 'Frequency',
        pathogenicity: 'Pathogenicity',
      },
      title: 'Variants Exploration',
      table: {
        alt: {
          title: 'ALT',
          tooltip: '# of alternative alleles',
        },
        CADD: {
          title: 'CADD',
          tooltip: 'CADD (Phred score)',
        },
        canonical: 'Ensembl Canonical',
        clinvar: 'ClinVar',
        clinvarAbrv: {
          conflicting_interpretations_of_pathogenicity: 'CI',
          benign: 'B',
          likely_benign: 'LB',
          uncertain_significance: 'VUS',
          pathogenic: 'P',
          not_provided: 'NP',
          drug_response: 'DR',
          risk_factor: 'RF',
          likely_pathogenic: 'LP',
          association: 'AS',
          other: 'O',
          affects: 'AF',
          protective: 'PV',
          confers_sensitivity: 'CS',
          uncertain_risk_allele: 'URA',
          association_not_found: 'ANF',
          likely_risk_allele: 'LRA',
          low_penetrance: 'LPN',
        },
        consequences: {
          title: 'Consequences',
          tooltip: 'Functional consequences of genetic variations annotated using VEP',
        },
        dbsnp: 'dbSNP',
        gene: 'Gene',
        genome_build: 'Genome build',
        gnomAD: {
          title: 'gnomAD',
          tooltip: 'gnomAD Genome 3.1.2 (allele frequency)',
        },
        gnomADAlt: {
          title: 'gnomAD ALT',
          tooltip: 'gnomAD Genome 3.1.2 (alternative allele count)',
        },
        homozygotes: {
          title: 'Homo.',
          tooltip: '# of homozygotes for alternative alleles',
        },
        inheritant: {
          code: {
            AD: 'Autosomal Dominant',
            AR: 'Autosomal Recessive',
            DD: 'Digenic Dominant',
            DR: 'Digenic Recessive',
            IC: 'Isolated Cases',
            Mi: 'Mitochondrial',
            Mu: 'Multifactorial',
            NRT: 'No Reported Transmission',
            SMo: 'Somatic Mosaicism',
            Smu: 'Somatic Mutation',
            XL: 'X-Linked',
            XLD: 'X-Linked Dominant',
            XLR: 'X-Linked Recessive',
            YL: 'Y-Linked',
          },
        },
        mane: 'MANE',
        manePlus: 'MANE Plus',
        maneSelect: 'MANE Select',
        mostDeleteriousConsequence: {
          title: 'Most Deleterious Consequence',
          tooltip: 'Functional consequences of genetic variations annotated using VEP',
        },
        omim: {
          title: 'OMIM',
          tooltip: 'MIM inheritance modes',
        },
        participant: {
          title: 'Part.',
          tooltip: '# of affected participants and frequency across Kids First cohorts',
        },
        revel: 'REVEL',
        studies: {
          title: 'Studies',
          tooltip: '# of studies with affected participants',
        },
        type: 'Type',
        variant: 'Variant',
        variant_class: 'Variant class',
        variant_id: 'Variant ID',
      },
      summary: {
        summary: 'Summary',
        variant: 'Variant',
        type: 'Type',
        cytoband: 'Cytoband',
        referenceGenome: 'Reference Genome',
        studies: 'Studies',
        studiesTooltip: 'Frequency of the variant across KF studies',
        participants: 'Participants',
        participantsTooltip:
          'Due to participant confidentiality, redirect to the Data Exploration page if the number of affected participants across Kids First cohorts ≥ 10',
        participantTooltip:
          '# of affected participants and frequency across KF cohorts</br></br>Due to participant confidentiality, redirect to the Data Exploration page is only permitted if the number of affected participants is ≥ 10 for a given cohort',
        genes: 'Genes',
        omim: 'OMIM',
        clinVar: 'ClinVar',
        gnomadGenome311: 'gnomAD Genome (v3.1.1)',
        gnomadGenome312: 'gnomAD Genome (v3.1.2)',
        dbSNP: 'dbSNP',
        germline: 'Germline',
        ensembl: 'Ensembl',
        consequence: 'Consequence',
        gnomAD: 'gnomAD',
        gnomADTooltip: 'gnomAD Genome 3.1.2 (allele frequency)',
        clinVarLabel: {
          affects: 'Affects',
          association: 'Association',
          association_not_found: 'Association Not Found',
          benign: 'Benign',
          confers_sensitivity: 'Confers Sensitivity',
          conflicting_interpretations_of_pathogenicity:
            'Conflicting Interpretations Of Pathogenicity',
          drug_response: 'Drug Response',
          likely_benign: 'Likely Benign',
          likely_pathogenic: 'Likely Pathogenic',
          likely_risk_allele: 'Likely Risk Allele',
          low_penetrance: 'Low Penetrance',
          not_provided: 'Not Provided',
          null: 'No Data',
          other: 'Other',
          pathogenic: 'Pathogenic',
          protective: 'Protective',
          risk_factor: 'Risk Factor',
          uncertain_risk_allele: 'Uncertain Risk Allele',
          uncertain_significance: 'Uncertain Significance',
        },
        canonicalTooltip: 'Canonical transcript',
        seeMore: 'See more',
        seeMorePopover: {
          title: 'RefSeq - {ensemblTranscriptId}',
        },
        details: {
          functionalScores: 'Functional Scores',
          geneConstraints: 'Gene Constraints',
          spliceAltering: 'Splice Altering',
          associatedConditions: 'Associated Conditions (OMIM)',
          sift: 'SIFT',
          fathmm: 'FATHMM',
          caddPhred: 'CADD (Phred)',
          caddRaw: 'CADD (Raw)',
          dann: 'DANN',
          lrt: 'LRT',
          revel: 'REVEL',
          polyphen2: 'PolyPhen-2 HVAR',
          polyphen2hvar: 'PolyPhen-2 HVAR',
          phyloP17Way: 'PhyloP17Way',
          spliceAi: 'SpliceAI',
          pli: 'pLI',
          loeuf: 'LOEUF',
          spliceAiType: {
            AG: 'Acceptor gain',
            AL: 'Acceptor loss',
            DG: 'Donor gain',
            DL: 'Donor loss',
          },
        },
      },
      consequences: {
        consequence: 'Consequence',
        impactTag: {
          modifier: 'MODIFIER',
          low: 'LOW',
          moderate: 'MODERATE',
          high: 'HIGH',
        },
        impactTooltip: {
          HIGH: 'High',
          LOW: 'Low',
          MODERATE: 'Moderate',
          MODIFIER: 'Modifier',
        },
        aaColumn: 'AA',
        aaColumnTooltip: 'Amino acid substitution',
        cdnaChangeColumn: 'Coding DNA',
        conservationColumn: 'Conservation',
        strand: 'Strand',
        vep: 'VEP',
        predictions: {
          prediction: 'Prediction',
          predictions: 'Predictions',
          sift: 'Sift',
          polyphen2: 'Polyphen2',
          fathmm: 'Fathmm',
          cadd: 'Cadd',
          caddRaw: 'CaddRaw',
          caddPhred: 'CaddPhred',
          dann: 'Dann',
          lrt: 'Lrt',
          revel: 'Revel',
        },
        transcript: 'Transcript',
        transcripts: 'Transcripts',
        refSeq: 'RefSeq',
        geneConsequence: 'Gene Consequence',
        gene: 'Gene',
        geneType: 'Gene Type',
        omim: 'OMIM',
        hideTranscript: 'Show less',
        showTranscript: '{count, plural, =1 {# other transcript} other {# other transcripts}}',
        canonical: 'Canonical transcript',
        gnomad: {
          pli: 'pLI',
          loeuf: 'LOEUF',
        },
        spliceAi: 'SpliceAI',
        conservation: 'Conservation',
        phyloP17Way: 'PhyloP17Way',
        pickedTooltip: 'Gene with most deleterious consequence',
      },
      frequencies: {
        kfStudies: 'Kids First Studies',
        publicCohorts: 'Public Cohorts',
        studies: 'Studies',
        domain: 'Domain',
        participants: 'Participants',
        participantsTooltip:
          '# of affected participants across KF cohorts.\n\n Due to participant confidentiality, redirect to the Data Exploration page is only permitted if the number of affected participants is ≥ 10 for a given cohort',
        participantsInfoIconTooltip:
          'Due to participant confidentiality, links may return a smaller number than displayed',
        frequencyTooltip: 'Frequency of the variant across Kids First studies',
        frequency: 'Frequency',
        altAlleles: '# ALT Alleles',
        altAllelesTooltip: 'Number of alternative alleles',
        homozygotes: '# Homozygotes',
        homozygotesTooltip: 'Number of homozygote variants',
        total: 'TOTAL',
        cohort: 'Cohort',
        altRef: '# Alleles (ALT + REF)',
        altRefTooltip: 'Number of alternative alleles + Reference alleles',
      },
      pathogenicity: {
        pathogenicity: 'Pathogenicity',
        clinVar: 'ClinVar',
        genePhenotype: 'Gene - Phenotype',
        source: 'Source',
        gene: 'Gene',
        condition: 'Condition',
        inheritance: 'Inheritance',
        inheritances: 'Inheritances',
        interpretation: 'Interpretation',
        germlineAbvr: 'GER',
        somaticAbvr: 'SOM',
        germline: 'Germline',
        somatic: 'Somatic',
      },
      conditions: {
        title: 'Condition',
        tableTitle: 'Gene - Phenotype Association',
      },
    },
    studies: {
      title: 'Studies',
      search: 'Search Studies',
      searchLabel: {
        title: 'Search by study code, study name, dbGaP',
        placeholder: 'KF-AIS, Kids First: Genomics of Orthopaedic Disease Program, phs001410',
      },
    },
    dataExploration: {
      title: 'Data Exploration',
      sidemenu: {
        study: 'Study',
        clinical: 'Clinical',
        participant: 'Participant',
        biospecimen: 'Biospecimen',
        datafiles: 'Data File',
      },
      itemSelectionTooltip: 'You must select at least 1 item',
      setsManagementDropdown: {
        newTitle: 'Save {filter} set',
        editTitle: 'Edit {filter} set',
        create: 'Save as new set',
        add: 'Add to existing set',
        remove: 'Remove from existing set',
        selected: '{count, plural, =0 {# {type}} =1 {# {type}} other {# {type}s}} selected',
        saveSet: 'Save {type} set',
      },
      hpoTree: {
        modal: {
          title: 'Observed Phenotype (HPO) Browser',
          okText: 'Apply',
        },
        searchPlaceholder: 'Search for ontology term - min 3 characters',
        emptySelection: 'Select items from the left-hand pane in order to add to your query.',
        tags: {
          exact: 'Participants with this exact term',
          all: 'Participants including descendant terms',
        },
      },
      mondoTree: {
        modal: {
          title: 'Diagnosis (MONDO) Browser',
          okText: 'Apply',
        },
        searchPlaceholder: 'Search for ontology term - min 3 characters',
        emptySelection: 'Select items from the left-hand pane in order to add to your query.',
        tags: {
          all: 'Participants including descendant terms',
        },
      },
      tabs: {
        summary: {
          title: 'Summary',
          download: {
            fileNameTemplate: 'kidsfirst-%name-%type-%date%extension',
            fileNameDateFormat: 'yyyy-MM-dd',
            download: 'Download',
            preview: 'Download Preview - ',
            data: 'Download data',
            svg: 'Download SVG',
            png: 'Download PNG',
          },
          demographic: {
            cardTitle: 'Demographics',
            sexTitle: 'Sex',
            raceTitle: 'Race',
            familyComposition: 'Family Composition',
            ethnicityTitle: 'Ethnicity',
          },
          availableData: {
            dataCategoryTitle: 'Participants by Data Category',
            dataTypeTitle: 'Participants by Data Type',
            studiesTitle: 'Participants by Study',
            mostFrequentPhenotypes: 'Most Frequent Phenotypes (HPO)',
            mostFrequentDiagnoses: 'Most Frequent Diagnoses (MONDO)',
          },
          observed_phenotype: {
            cardTitle: 'Observed Phenotypes (HPO)',
            phenotypeTree: {
              nbParticipant: '{count} participants (including descendant terms on this path)',
              addTermToQuery: 'Add term to active query',
              currentPath: 'Current Path',
            },
            empty: 'No observed phenotypes reported for these participants',
          },
          mondo: {
            cardTitle: ' Diagnosis (MONDO)',
            phenotypeTree: {
              nbParticipant: '{count} participants (including descendant terms on this path)',
              addTermToQuery: 'Add term to active query',
              currentPath: 'Current Path',
            },
            empty: 'No diagnoses reported for these participants',
          },
          ageAtDiagnosis: {
            cardTitle: 'Age at Diagnosis',
            _0to1: 'Newborn',
            _1to5: '[1-5]',
            _5to10: '[5-10]',
            _10to15: '[10-15]',
            _15to18: '[15-18]',
            _18plus: 'Adult',
          },
          studies: {
            cardTitle: 'Studies',
          },
          mostFrequentDiagnoses: {
            cardTitle: 'Most Frequent Diagnoses (MONDO)',
            legendAxisLeft: 'Diagnoses (MONDO)',
            legendAxisBottom: '# of participants',
          },
          mostFrequentPhenotypes: {
            cardTitle: 'Most Frequent Phenotypes (HPO)',
            legendAxisLeft: 'Phenotypes (HPO)',
            legendAxisBottom: '# of participants',
          },
        },
        participants: {
          title: 'Participants ({count})',
          downloadData: 'Download clinical data',
        },
        biospecimens: {
          title: 'Biospecimens ({count})',
          downloadData: 'Download sample data',
        },
        datafiles: {
          title: 'Data Files ({count})',
          cavatica: {
            title: 'Connect to Cavatica',
            analyseInCavatica: 'Analyze in Cavatica',
            bulkImportLimit: {
              title: 'Maximum file count exceeded',
              description:
                'You can copy a maximum of <strong>{limit} files</strong> at a time. Please select fewer files and try again.',
            },
            authWarning: {
              title: 'Connect to Cavatica',
              description:
                'In order to analyze your files you must first connect your Cavatica account. Once you are connected, you will be redirected back to this page.',
              connect: 'Connect',
              cancel: 'Cancel',
            },
            analyseModal: {
              title: 'Analyze in Cavatica',
              files: '{files} files',
              ofFiles: '(out of {files} selected) to your Cavatica workspace.',
              newProject: 'New project',
              copyFiles: 'Copy files',
              copyFilesTo: 'Copy files to...',
              createProjectToPushFileTo: 'Create a project to push your files to.',
              youAreAuthorizedToCopy: 'You are authorized to copy',
              disabledButtonTooltip: 'You must select at least 1 item',
            },
          },
        },
      },
    },
    join: {
      cancel: 'Cancel',
      next: 'Next',
      back: 'Back',
      submit: 'Submit',
      disclaimers: {
        title: 'KIDS FIRST Portal Registration Process',
        description:
          'The KIDS FIRST Portal is the primary entry point to the KIDS FIRST Data Hub. The KIDS FIRST Portal enables searching, visualizing, and accessing KIDS FIRST-relevant data. Some datasets may require additional approvals (e.g., dbGaP) and terms and conditions of access and use.',
        terms: {
          title: 'KIDS FIRST Portal Terms & Conditions',
          lastUpdate: 'Last Update: {date}',
          bullets: {
            1: 'My purpose for the use of KIDS FIRST Portal data is free from discrimination on the grounds of race, ethnicity, nationality, gender, age, physical and/or mental ability, sexual orientation, gender identity or expression, religion, or any other grounds that would impinge on an individual’s rights.',
            2: 'I will acknowledge specific dataset(s) and/or applicable accession number(s) as well as the KIDS FIRST Data Hub in my dissemination of research findings, as applicable to the medium or type of dissemination.',
            3: 'I will only share or distribute KIDS FIRST Portal data under terms consistent with this agreement, and the data or derivatives of the data may not be sold, in whole or in part, to any individual at any point in time for any purpose.',
            4: 'I will respect the privacy of research participants, and I will make no attempt to identify or contact individual participants or groups from whom data were collected or to generate information that could allow participants’ identities to be readily ascertained.',
            5: 'I agree to provide a brief statement regarding my intended use of the data on the KIDS FIRST Portal with my name and affiliation which will be publicly displayed for the purpose of transparency and collaboration.',
            6: 'I understand that participation in the KIDS FIRST community is voluntary and may be terminated by the KIDS FIRST Portal Administrator. I will report any actual or suspected violation of this agreement, even if unintentional, to the KIDS FIRST Portal Administrator. I understand that the KIDS FIRST Portal Administrator may take action to remedy any actual or suspected violation and/or report such behavior to the appropriate authorities.  I also understand that the KIDS FIRST Portal Administrator may immediately suspend or terminate my access to the KIDS FIRST Portal if there is an actual or suspected violation of this agreement.',
          },
          checkbox: 'I have read and agree to the KIDS FIRST Portal Terms and Conditions',
        },
        disclaimer: {
          title: 'KIDS FIRST Portal Disclaimers',
          bullets: {
            1: 'Data available in the KIDS FIRST Portal is provided on an AS-IS basis and may change over time.',
            2: 'The KIDS FIRST DCC does not warrant or assume any legal liability or responsibility for information, apparatus, product, or process contained in the KIDS FIRST Portal.',
            3: 'Content provided on the KIDS FIRST Portal is for informational purposes only and is not intended to be a substitute for independent professional medical judgment, advice, diagnosis, or treatment.',
          },
          checkbox: 'I have read and understand the KIDS FIRST Portal Disclaimers',
        },
        errors: 'Please accept the terms & conditions and portal disclaimers.',
      },
      registration: {
        notice:
          'Information provided here will be shared with the KIDS FIRST community on the KIDS FIRST Portal. All fields are required unless specified as optional.',
        sections: {
          identification: 'Identification',
          roleAndAffiliation: 'Role & Affiliation',
          researchAndDataUse: 'Research & Data Use',
        },
        labels: {
          firstName: 'First Name',
          lastName: 'Last Name',
          haveAUserID: 'I have an eRA Commons ID:',
          enterUserId: 'Please enter your eRA Commons ID',
          commercialUseReason:
            'Please provide a minimum of 1-2 sentences to describe your commercial use:',
          fullName: 'Full name',
          email: 'Email',
          iAmA: 'I am a:',
          pleaseDescribe: 'Please describe',
          iAmAffiliatedWith: 'I am affiliated with:',
          intendToUser: 'I intend to use the KIDS FIRST Portal data for:',
          dataUseStatement: 'Data use statement',
          researchAreaDescribe: 'My research area or area of interest may best be described as:',
        },
        placeHolders: {
          firstLast: 'First Last',
        },
        helps: {
          checkAllThatApply: 'Check all that apply',
          describeUseBelow: 'For other purpose, you must describe your use below',
          provideBriefDescription:
            'Provide a brief description and a link to your professional biography or organization website, if available',
          provideOrgAffiliation: 'Provide institutional or organizational affiliation',
        },
        noticeNotPublicInfo: 'This information will not be made public.',
        nameAndEmailOfIndividual:
          'Please provide the name and email address of an individual at your institution, organization, or similar who is aware of your intended use of the data (We do not expect to contact this individual except in cases where we need to verify your identity).',
        roleOptions: {
          1: 'Researcher at an academic or not-for-profit institution',
          2: 'Representative from a For-Profit or Commercial Entity',
          3: 'Tool or Algorithm Developer',
          4: 'Clinician',
          5: 'Community member',
          6: 'Federal Employee',
        },
        usageOptions: {
          1: 'Learning more about Down syndrome and its health outcomes, management, and/or treatment',
          2: 'Helping me design a new research study',
          3: 'Identifying datasets that I want to analyze',
          4: 'Commercial purposes',
        },
        userIdOptions: {
          1: 'Yes',
          2: 'No',
        },
        optionsOther: 'Other',
        noAffiliationOption: 'I do not have an institutional affiliation.',
      },
    },
  },
  facets: {
    file_id: 'File ID',
    // Participant
    participant_id: 'Participant ID',
    participant_facet_ids: {
      participant_fhir_id_1: 'Participant ID',
      participant_fhir_id_2: 'Participant ID',
    },
    file_facet_ids: {
      file_fhir_id_1: 'File ID',
      file_fhir_id_2: 'File ID',
    },
    biospecimen_facet_ids: {
      biospecimen_fhir_id_1: 'Sample ID',
      biospecimen_fhir_id_2: 'Sample ID',
    },
    study: {
      study_code: 'Study Code',
      study_name: 'Study Name',
      external_id: 'dbGaP Accession Number',
    },
    family: {
      family_id: 'Family ID',
    },
    studies: {
      study_code: 'Study Code',
      zygosity: 'Zygosity',
      transmission: 'Transmission',
    },
    is_proband: 'Proband',
    study_id: 'Study Code',
    down_syndrome_status: 'Down Syndrome Status',
    down_syndrome_diagnosis: 'Down Syndrome Diagnosis',
    mondo: {
      name: 'Diagnosis (MONDO)',
    },
    diagnosis: {
      affected_status: 'Clinical Status',
      mondo_display_term: 'Diagnosis (MONDO)',
      ncit_id_diagnosis: 'Diagnosis (NCIT)',
      age_at_event_days: 'Age at Diagnosis (days)',
      source_text: 'Diagnosis (Source Text)',
      source_text_tumor_location: 'Tumor Location (Source Text)',
    },
    outcomes: {
      age_at_event_days: {
        value: 'Age at Vital Status (days)',
      },
      vital_status: 'Vital Status',
    },
    phenotype: {
      hpo_phenotype_observed: 'Observed Phenotype (HPO)',
      hpo_phenotype_not_observed: 'Not Observed Phenotype (HPO)',
      age_at_event_days: 'Age at Observed Phenotype (days)',
      source_text: 'Observed Phenotype (Source Text)',
    },
    age_at_data_collection: 'Age at data collection',
    family_type: 'Family Composition',
    sex: 'Sex',
    ethnicity: 'Ethnicity',
    race: 'Race',
    observed_phenotype: {
      name: 'Phenotype (HPO)',
    },
    options: {
      D21: 'Disomy 21, euploid',
      T21: 'Trisomy 21',
    },

    // Biospecimen
    biospecimen_type: 'Biospecimen Type',
    sample_type: 'Sample Type',
    derived_sample_type: 'Derived Sample Type',
    ncit_id_tissue_type: 'Tissue Type (NCIT)',
    status: 'Sample Availability',
    age_at_biospecimen_collection: 'Age at Biospec. Collection (days)',
    bio_repository: 'Biorepository',
    collection_ncit_anatomy_site_id: 'Anatomical Site (NCIT)',
    collection_anatomy_site: 'Anatomical Site (Source Text)',
    collection_method_of_sample_procurement: 'Method of Sample Procurement',
    dbgap_consent_code: 'dbGaP Consent Code',
    tissue_type_source_text: 'Tissue Type (Source Text)',
    sample_id: 'Sample ID',
    diagnoses: {
      source_text_tumor_descriptor: 'Tumor Descriptor (Source Text)',
      source_text: 'Histological Diagnosis (Source Text)',
      source_text_tumor_location: 'Tumor Location (Source Text)',
      age_at_event: {
        value: 'Age at Histological Diagnosis (days)',
      },
      mondo_display_term: 'Histological Diagnosis (MONDO)',
      diagnosis_ncit: 'Histological Diagnosis (NCIT)',
    },
    // File
    files: filesFacets,
    ...filesFacets,

    //Other
    collection_sample_type: 'Collection Sample Type',
    collection_sample_id: 'Collection ID',

    //Variants
    variant_class: 'Variant Type',
    type: 'Type',
    chromosome: 'Chromosome',
    position: 'Position',
    zygosity: 'Zygosity',
    transmissions: 'Transmission',
    genePanels: 'Gene Panels',
    start: 'Position',
    locus: 'Variant ID',
    consequences: {
      consequences: 'Consequence',
      biotype: 'Gene Type',
      vep_impact: 'VEP',
      symbol: 'Gene Symbol',
      symbol_id_1: 'Genes',
      predictions: {
        sift_pred: 'SIFT',
        polyphen2_hvar_pred: 'PolyPhen-2 HVAR',
        fathmm_pred: 'FATHMM',
        cadd_rankscore: 'CADD',
        lrt_pred: 'LRT',
        revel_rankscore: 'REVEL',
        dann_rankscore: 'DANN',
      },
    },
    genes: {
      consequences: {
        consequence: 'Consequence',
        vep_impact: 'VEP',
        predictions: {
          cadd_score: 'CADD (Raw)',
          cadd_phred: 'CADD (Phred)',
          dann_score: 'DANN',
          fathmm_pred: 'FATHMM',
          lrt_pred: 'LRT',
          polyphen2_hvar_pred: 'PolyPhen-2 HVAR',
          revel_score: 'REVEL',
          sift_pred: 'SIFT',
        },
      },
      biotype: 'Gene Type',
      gnomad: {
        pli: 'gnomAD pLI',
        loeuf: 'gnomAD LOEUF',
      },
      spliceai: {
        ds: 'SpliceAI',
      },
      hpo: {
        hpo_term_label: 'HPO',
      },
      orphanet: {
        panel: 'ORPHANET',
      },
      omim: {
        name: 'OMIM',
      },
      ddd: {
        disease_name: 'DDD',
      },
      cosmic: {
        tumour_types_germline: 'COSMIC',
      },
    },
    clinvar: {
      clin_sig: 'ClinVar',
    },
    external_frequencies: {
      gnomad_genomes_2_1_1: {
        af: 'gnomAD Genome 2.1.1',
      },
      gnomad_genomes_3: {
        af: 'gnomAD Genome 3.1.2',
      },
      gnomad_exomes_2_1_1: {
        af: 'gnomAD Exome 2.1.1',
      },
      topmed_bravo: {
        af: 'TopMed',
      },
      thousand_genomes: {
        af: '1000 Genomes',
      },
    },
    internal_frequencies: {
      total: {
        af: 'KF Allele Frequency',
      },
    },
    frequencies: {
      internal: {
        upper_bound_kf: { af: 'KF Allele Frequency' },
      },
      gnomad_genomes_2_1: {
        af: 'gnomAD Genome 2.1',
      },
      gnomad_genomes_3_0: {
        af: 'gnomAD Genome 3.0',
      },
      gnomad_genomes_3_1_1: {
        af: 'gnomAD Genome 3.1',
      },
      gnomad_exomes_2_1: {
        af: 'gnomAD Exome 2.1',
      },
      topmed: {
        af: 'TopMed',
      },
      one_thousand_genomes: {
        af: '1000 Genomes',
      },
    },
    // Studies
    search_text: 'Study Code',
    domain: 'Domain',
    population: 'Population',
    donors: {
      diagnoses: {
        tagged_icd: {
          main_category: 'Disease Type (ICD-10)',
        },
        tagged_mondo: {
          main_category: 'Diagnosis (MONDO)',
        },
      },
      observed_phenotype_tagged: {
        main_category: 'Type of Phenotypic Abnormality (HPO)',
      },
    },
  },
  entities: {
    global: {
      id: 'ID',
      summary: 'Summary',
    },
    file: {
      fileAuthorization: 'File Authorization',
      fileReadMore: 'applying for data access.',
      locked:
        'You are unauthorized to access this file. Users requesting access to controlled data require an eRA Commons account and permissions from an associated Data Access Committee. Read more on',
      unlocked: 'You are authorized to access and copy this file to your Cavatica workspace.',
      data_access: {
        title: 'Data Access',
        access: 'Access',
        dbgap_accession_number: 'dbGaP Accession Number',
        consent_codes: 'Consent Codes',
        fileAuthorization: 'File Authorization',
        apply_data_access: 'applying for data access',
        category: 'Category',
        count: '{count, plural, =0 {File} =1 {File} other {Files}}',
        data_access: 'Data Access',
        data_category: 'Data Category',
        data_category_count: 'File counts by Data Category',
        data_type: 'Data Type',
        experimental_strategy: 'Experimental Strategy',
        experimental_strategy_count: 'File counts by Experimental Strategy',
        file: 'Data File',
        file_id: 'ID',
        file_name: 'File Name',
        files: 'Files',
        format: 'Format',
        hash: 'Hash',
        locked:
          'You are unauthorized to access this file. Users requesting access to controlled data require an eRA Commons account and permissions from an associated Data Access Committee. Read more on',
        manifest: 'Manifest',
        participants: 'Participants',
        participant_sample: 'Participant / Sample',
        size: 'Size',
        type: 'Type',
        unlocked: 'You are authorized to access and copy this file to your Cavatica workspace.',
        url: 'URL',
      },
      data_type: {
        title: 'Data Type',
        category: 'Category',
        type: 'Type',
        is_harmonized: 'Harmonized Data',
      },
      participant_sample: {
        collection_id: 'Collection ID',
        collection_sample_type: 'Collection Sample Type',
        external_collection_id: 'External Collection ID',
        external_participant_id: 'External Participant ID',
        external_sample_id: 'External Sample ID',
        participant_id: 'Participant ID',
        proband: 'Proband',
        sample_id: 'Sample ID',
        sample_type: 'Sample Type',
        study: 'Study',
        tissue_type_ncit: 'Tissue Type (NCIT)',
        tissue_type_source_text: 'Tissue Type (Source Text)',
        title: 'Participant / Sample',
      },
      experimental_procedure: {
        title: 'Experimental Procedure',
        experimental_strategy: 'Experimental Strategy',
        sequencing_type: 'Sequencing Type',
        platform: 'Platform',
        instrument_model: 'Instrument Model',
        library_strand: 'Library Strand',
        library_name: 'Library Name',
        total_reads: 'Total Reads',
        max_insert_size: 'Max Insert Size',
        mean_insert_size: 'Mean Insert Size',
        mean_depth: 'Mean Depth',
        mean_read_length: 'Mean Read Length',
        experiment_date: 'Experiment Date',
        sequencing_center_id: 'Sequencing Center ID',
      },
      summary: {
        title: 'Summary',
        file_id: 'ID',
        file_name: 'Name',
        study: 'Study',
        format: 'Format',
        size: 'Size',
        url: 'URL',
        hash: 'Hash',
        studies: '{count, plural, =0 {Study} =1 {Study} other {Studies}}',
        participants: '{count, plural, =0 {Participant} =1 {Participant} other {Participants}}',
        biospecimens: '{count, plural, =0 {Biospecimen} =1 {Biospecimen} other {Biospecimens}}',
      },
      access: 'Access',
      access_url: 'Access URL',
      acl: 'ACL',
      apply_data_access: 'applying for data access',
      category: 'Category',
      count: '{count, plural, =0 {File} =1 {File} other {Files}}',
      data_category: 'Data Category',
      data_category_count: 'File counts by Data Category',
      dbgap_accession_number: 'dbGaP Accession Number',
      experimental_strategy: 'Experimental Strategy',
      experimental_strategy_count: 'File counts by Experimental Strategy',
      file: 'Data File',
      file_id: 'File ID',
      file_name: 'Name',
      files: 'Files',
      format: 'Format',
      hash: 'Hash',
      repository: 'Repository',
      size: 'Size',
      type: 'Type',

      url: 'URL',
    },
    biospecimen: {
      age_tooltip: 'Age at Biospecimen Collection',
      anatomical_site_NCIT: 'Anatomical Site (NCIT)',
      anatomical_site: 'Anatomical Site (Source Text)',
      biospecimen: 'Biospecimen',
      biospecimens: 'Biospecimens',
      biospecimen_storage: 'Biospecimen Storage',
      collection_id: 'Collection ID',
      collection_sample_type: 'Collection Sample Type',
      consent_type: 'Consent Type',
      container_id: 'Container ID',
      count: '{count, plural, =0 {Biospecimen} =1 {Biospecimen} other {Biospecimens}}',
      dbgap_consent_code: 'Consent Code (dbGaP)',
      laboratory_procedure: 'Laboratory Procedure',
      parent_sample_id: 'Parent Sample ID',
      parent_sample_type: 'Parent Sample Type',
      sample_availabilty: 'Sample Availability',
      sample_id: 'Sample ID',
      sample_type: 'Sample Type',
      tissue_type_NCIT: 'Tissue Type (NCIT)',
      tissue_type: 'Tissue Type (Source Text)',
      volume: 'Volume',
      volume_unit: 'Volume Unit',
      collection_method_of_sample_procurement: 'Method of Sample Procurement',
      tissue_type_source_text: 'Tissue Type (Source Text)',
      ncit_id_tissue_type: 'Tissue Type (NCIT)',
      external_sample_id: 'External Sample ID',
      external_pt_id: 'External Participant ID',
      diagnoses: {
        source_text: 'Histological Diagnosis (Source Text)',
        source_text_tumor_descriptor: 'Tumor Descriptor (Source Text)',
        diagnosis_ncit: 'Histological Diagnosis (NCIT)',
        mondo_display_term: 'Histological Diagnosis (MONDO)',
        source_text_tumor_location: 'Tumor Location (Source Text)',
      },
    },
    participant: {
      age: 'Age',
      age_tooltip_diagnosis: 'Age at Diagnosis',
      age_tooltip_phenotype: 'Age at Phenotype',
      count: '{count, plural, =0 {Participant} =1 {Participant} other {Participants}}',
      dbgap: 'dbGaP',
      diagnosis: 'Diagnosis',
      diagnosis_NCIT: 'Diagnosis (NCIT)',
      diagnosis_source_text: 'Diagnosis (Source Text)',
      disomy: 'D21: "Disomy 21, euploid"',
      vital_status: 'Vital Status',
      duo: 'Duo',
      ethnicity: 'Ethnicity',
      external_id: 'Ext. Participant ID',
      external_id_tooltip: 'External Participant ID',
      family: 'Family',
      family_id: 'Family ID',
      family_relationship: 'Family Relationship',
      family_unit: 'Family Composition',
      hpo_phenotype_observed: 'Observed Phenotype (HPO)',
      hpo_term: 'HPO Term',
      hpo_term_tooltip: '# of participants with this exact HPO term',
      interpretation: 'Interpretation',
      mondo_diagnosis: 'Diagnosis (MONDO)',
      mondo_term: 'MONDO Term',
      mondo_term_tooltip: '# of participants with this exact MONDO term',
      nb_biospecimens: 'Biospecimens',
      nb_files: 'Files',
      not_observed: 'Not observed',
      observed: 'Observed',
      other: 'Other',
      participant_id: 'Participant ID',
      pedcBioPortal: 'PedcBioPortal',
      phenotype: 'Phenotype',
      phenotype_hpo: 'Phenotype (HPO)',
      phenotypes_hpo_not_observed: 'Not Observed Phenotype (HPO)',
      phenotype_source_text: 'Phenotype (Source Text)',
      proband: 'Proband',
      proband_only: 'Proband-only',
      profile: 'Profile',
      race: 'Race',
      sex: 'Sex',
      source_text_phenotype: 'Observed Phenotype (Source Text)',
      study: 'Study',
      trio: 'Trio',
      trio_plus: ' Trio+',
      trisomy: 'T21: "Trisomy 21"',
      age_at_vital_status: 'Age at Vital Status',
    },
    study: {
      count: '{count, plural, =0 {Study} =1 {Study} other {Studies}}',
      study: 'Study',
    },
    variant: {
      participant: '{count, plural, =0 {Participant} =1 {Participant} other {Participants}}',
      type: {
        abrv: {
          insertion: 'Ins',
          deletion: 'Del',
          snv: 'SNV',
          null: 'ND',
          indel: 'Ind',
          substitution: 'Sub',
          sequence_alteration: ' SeqAlt',
        },
        tooltip: {
          insertion: 'Insertion',
          deletion: 'Deletion',
          snv: 'SNV',
          null: 'No Data',
          indel: 'Indel',
          substitution: 'Substitution',
          sequence_alteration: 'Sequence Alteration',
        },
      },
      no_gene: 'No gene',
    },
  },
};

export default en;
