export type StudiesResult = {
  kf_id: string;
  name: string;
  domain: string;
  score: string;
  code: string;
  family_count: string;
  file_count: string;
};

export const studiesColumns = [
  {
    title: 'Code',
    name: 'code',
  },
  {
    title: 'Name',
    name: 'name',
  },
  {
    title: 'Program',
    name: 'program',
  },
  {
    title: 'Domain',
    name: 'domain',
  },
  {
    title: 'Participants',
    name: 'participant_count',
  },
  {
    title: 'Families',
    name: 'family_count',
  },
  {
    title: 'Files',
    name: 'file_count',
  },
].map((c) => ({ ...c, key: c.name, dataIndex: c.name }));

export const fields = [
  'domain',
  'program',
  'family_data',
  'available_data_types',
  'experimental_strategy',
];
