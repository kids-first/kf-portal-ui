export const emptyUserConfig = {};

export const userConfig = {
  variants: {
    tables: {
      variants: {
        columns: [
          {
            key: 'variant_class',
            index: 16,
            visible: true,
          },
          {
            key: 'rsnumber',
            index: 17,
            visible: true,
          },
          {
            key: 'genes',
            index: 18,
            visible: true,
          },
        ],
      },
    },
  },
  dashboard: {
    cards: {
      order: ['7', '2', '3', '4', '5', '6'],
    },
  },
  data_exploration: {
    tables: {
      datafiles: {
        columns: [
          {
            key: 'lock',
            index: 16,
            visible: true,
          },
          {
            key: 'controlled_access',
            index: 17,
            visible: true,
          },
          {
            key: 'file_id',
            index: 18,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 19,
            visible: true,
          },
        ],
      },
      biospecimens: {
        columns: [
          {
            key: 'sample_id',
            index: 25,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 26,
            visible: true,
          },
          {
            key: 'sample_type',
            index: 27,
            visible: true,
          },
        ],
      },
      participants: {
        columns: [
          {
            key: 'participant_id',
            index: 20,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 21,
            visible: true,
          },
          {
            key: 'study_external_id',
            index: 22,
            visible: true,
          },
        ],
      },
    },
    summary: {
      layouts: [
        {
          id: 'observed_phenotype',
          lg: {
            h: 4,
            w: 8,
            x: 0,
            y: 0,
          },
          base: {
            h: 4,
            w: 8,
            x: 0,
            y: 0,
            isResizable: false,
          },
          title: 'Observed Phenotypes (HPO)',
        },
        {
          id: 'mondo',
          lg: {
            h: 4,
            w: 8,
            x: 8,
            y: 0,
          },
          base: {
            h: 4,
            w: 8,
            x: 8,
            y: 0,
            isResizable: false,
          },
          title: ' Diagnosis (MONDO)',
        },
      ],
    },
  },
};

export const userConfigWithoutVariant = {
  dashboard: {
    cards: {
      order: ['7', '2', '3', '4', '5', '6'],
    },
  },
  data_exploration: {
    tables: {
      datafiles: {
        columns: [
          {
            key: 'lock',
            index: 16,
            visible: true,
          },
          {
            key: 'controlled_access',
            index: 17,
            visible: true,
          },
          {
            key: 'file_id',
            index: 18,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 19,
            visible: true,
          },
        ],
      },
      biospecimens: {
        columns: [
          {
            key: 'sample_id',
            index: 25,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 26,
            visible: true,
          },
          {
            key: 'sample_type',
            index: 27,
            visible: true,
          },
        ],
      },
      participants: {
        columns: [
          {
            key: 'participant_id',
            index: 20,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 21,
            visible: true,
          },
          {
            key: 'study_external_id',
            index: 22,
            visible: true,
          },
        ],
      },
    },
    summary: {
      layouts: [
        {
          id: 'observed_phenotype',
          lg: {
            h: 4,
            w: 8,
            x: 0,
            y: 0,
          },
          base: {
            h: 4,
            w: 8,
            x: 0,
            y: 0,
            isResizable: false,
          },
          title: 'Observed Phenotypes (HPO)',
        },
        {
          id: 'mondo',
          lg: {
            h: 4,
            w: 8,
            x: 8,
            y: 0,
          },
          base: {
            h: 4,
            w: 8,
            x: 8,
            y: 0,
            isResizable: false,
          },
          title: ' Diagnosis (MONDO)',
        },
      ],
    },
  },
};

export const updatedConfigSummary = {
  data_exploration: {
    summary: {
      layouts: [
        {
          title: 'Observed Phenotypes (HPO)',
          id: 'observed_phenotype',
          base: {
            h: 4,
            isResizable: false,
            w: 8,
            x: 0,
            y: 0,
          },
          lg: {
            h: 4,
            w: 8,
            x: 0,
            y: 0,
          },
          md: {
            h: 4,
            w: 6,
            x: 0,
            y: 0,
          },
          sm: {
            h: 4,
            w: 5,
            x: 0,
            y: 0,
          },
          xs: {
            h: 4,
            w: 6,
            x: 0,
            y: 0,
          },
          xxs: {
            h: 4,
            w: 4,
            x: 0,
            y: 0,
          },
          hidden: true,
        },
        {
          title: ' Diagnosis (MONDO)',
          id: 'mondo',
          base: {
            h: 4,
            isResizable: false,
            w: 8,
            x: 8,
            y: 0,
          },
          lg: {
            h: 4,
            w: 8,
            x: 8,
            y: 0,
          },
          md: {
            h: 4,
            w: 6,
            x: 6,
            y: 0,
          },
          sm: {
            h: 4,
            w: 5,
            x: 5,
            y: 0,
          },
          xs: {
            h: 4,
            w: 6,
            x: 0,
            y: 4,
          },
          xxs: {
            h: 4,
            w: 4,
            x: 0,
            y: 4,
          },
        },
      ],
    },
  },
};

export const updatedConfigParticipant = {
  data_exploration: {
    tables: {
      participants: {
        columns: [
          {
            key: 'participant_id',
            index: 20,
            visible: true,
          },
          {
            key: 'study.study_code',
            index: 21,
            visible: true,
          },
          {
            key: 'study_external_id',
            index: 22,
            visible: false,
          },
        ],
      },
    },
  },
};

export const updatedConfigVariant = {
  variants: {
    tables: {
      variants: {
        columns: [
          {
            key: 'variant_class',
            index: 16,
            visible: true,
          },
          {
            key: 'rsnumber',
            index: 17,
            visible: false,
          },
          {
            key: 'genes',
            index: 18,
            visible: true,
          },
        ],
      },
    },
  },
};

export const updatedConfigDashboard = {
  dashboard: {
    cards: {
      order: ['2', '3', '4', '5', '6', '7'],
    },
  },
};
