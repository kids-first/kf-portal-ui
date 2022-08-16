export interface IPhenotypeSource {
  key: string;
  doc_count: number;
  top_hits: {
    parents: string[];
  };
  filter_by_term: any;
}
