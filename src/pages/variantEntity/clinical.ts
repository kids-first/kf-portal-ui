import {
  Cosmic,
  Ddd,
  Gene,
  Hpo,
  Omim,
  Orphanet,
  HitsEdges,
  ClinVar,
} from 'store/graphql/variants/models';
import { toKebabCase } from 'utils';

enum Source {
  orphanet = 'Orphanet',
  omim = 'OMIM',
  hpo = 'HPO',
  ddd = 'Ddd',
  cosmic = 'Cosmic',
}

const getEdgesOrDefault = (arr: HitsEdges) => arr?.hits?.edges || [];

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
        source: Source.orphanet,
        gene: gene.node.symbol,
        condition: orphanetEdges.map((orphanetNode: Orphanet) => [
          orphanetNode.node.panel,
          orphanetNode.node.disorder_id,
        ]),
        inheritance: orphanetEdges
          .map((orphanetNode: Orphanet) => orphanetNode.node.inheritance)
          .flat(),
      };
    }

    const omimNode = gene.node.omim;
    const omimNodeEdges = getEdgesOrDefault(omimNode);
    let rowOmim;
    if (omimNodeEdges.length > 0) {
      rowOmim = {
        source: Source.omim,
        gene: [gene.node.symbol, gene.node.omim_gene_id],
        condition: omimNodeEdges?.map((omimNode: Omim) => [
          omimNode.node.name,
          omimNode.node.omim_id,
        ]),
        inheritance: (omimNodeEdges.map((omimNode: Omim) => omimNode.node.inheritance) || [])
          .filter((e) => e)
          .flat(),
      };
    }

    const hpoNode = gene.node.hpo;
    const hpoNodeEdges = getEdgesOrDefault(hpoNode);
    let rowHpo;
    if (hpoNodeEdges.length > 0) {
      rowHpo = {
        source: Source.hpo,
        gene: gene.node.symbol,
        condition: hpoNodeEdges.map((hpoNode: Hpo) => [
          hpoNode.node.hpo_term_label,
          hpoNode.node.hpo_term_id,
        ]),
        inheritance: '--',
      };
    }

    const dddNode = gene.node.ddd;
    const dddNodeEdges = getEdgesOrDefault(dddNode);
    let rowDdd;
    if (dddNodeEdges.length > 0) {
      rowDdd = {
        source: Source.ddd,
        gene: gene.node.symbol,
        condition: dddNodeEdges.map((dddNode: Ddd) => dddNode.node.disease_name),
        inheritance: '--',
      };
    }

    const cosmicNode = gene.node.cosmic;
    const cosmicNodeEdges = getEdgesOrDefault(cosmicNode);
    let rowCosmic;
    if (cosmicNodeEdges.length > 0) {
      rowCosmic = {
        source: Source.cosmic,
        gene: gene.node.symbol,
        condition: cosmicNodeEdges.map(
          (cosmicNode: Cosmic) => cosmicNode.node.tumour_types_germline,
        ),
        inheritance: '--',
      };
    }
    return [rowOrphanet, rowOmim, rowHpo, rowDdd, rowCosmic].filter((row) => row).flat();
  });
};

export const groupRowsBySource = (ungroupedDataTable: any[]) => {
  const orphanetRows = ungroupedDataTable.flat().filter((row) => row.source === Source.orphanet);
  const omimRows = ungroupedDataTable.flat().filter((row) => row.source === Source.omim);
  const hpoRows = ungroupedDataTable.flat().filter((row) => row.source === Source.hpo);
  const cosmicRows = ungroupedDataTable.flat().filter((row) => row.source === Source.cosmic);
  return [...orphanetRows, ...omimRows, ...hpoRows, ...cosmicRows];
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
    condition: row.condition,
    inheritance: row.inheritance,
    key: toKebabCase(`${index}-${[row.gene].flat().join('-')}`),
  }));
};
