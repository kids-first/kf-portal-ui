import {
  ClinVar,
  Conditions,
  Cosmic,
  Ddd,
  Gene,
  HitsEdges,
  Hpo,
  Inheritance,
  Omim,
  Orphanet,
  ClinicalGenesTableSource,
} from 'store/graphql/variants/models';
import { toKebabCase } from 'utils';

const getEdgesOrDefault = (arr: HitsEdges) => arr?.hits?.edges || [];

const keepOnlyOmimWithId = (arr: Omim[]) => arr.filter((omimNode: Omim) => omimNode.node.omim_id);

export const makeClinVarRows = (clinvar: ClinVar) => {
  if (!clinvar || !clinvar.conditions?.length) {
    return [];
  }
  const inheritance = (clinvar.inheritance || [])[0] || '';
  const interpretation = (clinvar.clin_sig || [])[0] || '';

  return clinvar.conditions.map((condition: string, index: number) => ({
    key: `${index}`,
    inheritance,
    interpretation,
    condition,
  }));
};

export const makeUnGroupedDataRows = (genes: Gene[]) => {
  if (!genes) {
    return [];
  }
  return genes.map((gene: Gene) => {
    const orphanetNode = gene.node.orphanet;
    const orphanetEdges = getEdgesOrDefault(orphanetNode);

    let rowOrphanet;
    if (orphanetEdges.length > 0) {
      rowOrphanet = {
        source: ClinicalGenesTableSource.orphanet,
        gene: gene.node.symbol,
        conditions: orphanetEdges.map((orphanetNode: Orphanet) => ({
          panel: orphanetNode.node.panel,
          disorderId: orphanetNode.node.disorder_id,
        })),
        inheritance: orphanetEdges.map((orphanetNode: Orphanet) => orphanetNode.node.inheritance),
      };
    }

    const omimNode = gene.node.omim;
    const omimNodeEdges = getEdgesOrDefault(omimNode);
    let rowOmim;
    if (omimNodeEdges.length > 0) {
      const filteredOmim = keepOnlyOmimWithId(omimNodeEdges);
      rowOmim = {
        source: ClinicalGenesTableSource.omim,
        gene: [gene.node.symbol, gene.node.omim_gene_id],
        conditions: filteredOmim.map((omimNode: Omim) => ({
          omimName: omimNode.node.name,
          omimId: omimNode.node.omim_id,
        })),
        inheritance: filteredOmim.map((omimNode: Omim) => omimNode.node.inheritance) || [],
      };
    }

    const hpoNode = gene.node.hpo;
    const hpoNodeEdges = getEdgesOrDefault(hpoNode);
    let rowHpo;
    if (hpoNodeEdges.length > 0) {
      rowHpo = {
        source: ClinicalGenesTableSource.hpo,
        gene: gene.node.symbol,
        conditions: hpoNodeEdges.map((hpoNode: Hpo) => ({
          hpoTermLabel: hpoNode.node.hpo_term_label,
          hpoTermTermId: hpoNode.node.hpo_term_id,
        })),
        inheritance: '',
      };
    }

    const dddNode = gene.node.ddd;
    const dddNodeEdges = getEdgesOrDefault(dddNode);
    let rowDdd;
    if (dddNodeEdges.length > 0) {
      rowDdd = {
        source: ClinicalGenesTableSource.ddd,
        gene: gene.node.symbol,
        conditions: dddNodeEdges.map((dddNode: Ddd) => dddNode.node.disease_name),
        inheritance: '',
      };
    }

    const cosmicNode = gene.node.cosmic;
    const cosmicNodeEdges = getEdgesOrDefault(cosmicNode);
    let rowCosmic;
    if (cosmicNodeEdges.length > 0) {
      rowCosmic = {
        source: ClinicalGenesTableSource.cosmic,
        gene: gene.node.symbol,
        conditions: cosmicNodeEdges
          .map((cosmicNode: Cosmic) => cosmicNode.node.tumour_types_germline)
          .flat(),
        inheritance: '',
      };
    }
    return [rowOrphanet, rowOmim, rowHpo, rowDdd, rowCosmic].filter((row) => row).flat();
  });
};

export const groupRowsBySource = (ungroupedDataTable: any[]) => {
  const orphanetRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.orphanet);
  const omimRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.omim);
  const hpoRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.hpo);
  const dddRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.ddd);
  const cosmicRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.cosmic);
  return [...orphanetRows, ...omimRows, ...hpoRows, ...dddRows, ...cosmicRows];
};

export const makeGenesOrderedRow = (genesHits: HitsEdges) => {
  const genes = genesHits?.hits?.edges;
  if (!genes || genes.length === 0) {
    return [];
  }
  const ungroupedRows = makeUnGroupedDataRows(genes);
  const groupedRows = groupRowsBySource(ungroupedRows);
  return groupedRows.map((row, index) => ({
    source: row.source,
    gene: row.gene,
    conditions: row.conditions as Conditions,
    inheritance: row.inheritance as Inheritance,
    key: toKebabCase(`${index}-${[row.gene].flat().join('-')}`),
  }));
};
