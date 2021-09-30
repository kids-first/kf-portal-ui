import { HitsResultsDataCategory, StudiesResults } from './actions';

export type StudiesResult = {
  id: string;
  name: string;
  domain: string[];
  score: string;
  code: string;
  family_count: string;
  file_count: string;
  data_category_count?: HitsResultsDataCategory;
  data_access_authority: string;
  external_id: string;
};

export type DataCategory = {
  data_category: string;
  count: number;
};

export const generateTableData = (studiesResults: StudiesResults) =>
  studiesResults.data?.hits.edges.map((edge) => {
    const data_category = edge.node.data_category_count?.hits.edges.map((d) => ({
      data_category: d.node.data_category,
      count: d.node.count,
    }));
    return {
      ...edge.node,
      seq: data_category?.find((d) => d.data_category === 'Sequencing Reads')?.count || null,
      snv:
        data_category?.find((d) => d.data_category === 'Simple Nucleotide Variation')?.count ||
        null,
      cnv: data_category?.find((d) => d.data_category === 'Copy Number Variation')?.count || null,
      exp: data_category?.find((d) => d.data_category === 'Transcriptome Profiling')?.count || null,
      sv: data_category?.find((d) => d.data_category === 'Structural Variation')?.count || null,
      pat: data_category?.find((d) => d.data_category === 'Pathology')?.count || null,
      rad: data_category?.find((d) => d.data_category === 'Radiology')?.count || null,
      other: data_category?.find((d) => d.data_category === 'Other')?.count || null,
      key: edge.node.code,
    };
  });

export const fields = [
  'domain',
  'program',
  'family_data',
  'data_categories',
  'experimental_strategy',
];
