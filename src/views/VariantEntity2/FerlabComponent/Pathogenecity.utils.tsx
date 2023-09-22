import { IArrangerEdge, IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import {
  ClinicalGenesTableSource,
  Conditions,
  Inheritance,
} from '@ferlab/ui/core/pages/EntityPage/type';
import { groupRowsBySource } from '@ferlab/ui/core/pages/EntityPage/utils/pathogenicity';
import { toKebabCase } from '@ferlab/ui/core/utils/stringUtils';
import {
  IGeneCosmic,
  IGeneDdd,
  IGeneEntity,
  IGeneHpo,
  IGeneOmim,
  IGeneOrphanet,
} from 'graphql/variants2/models';

const orphanetFromEdges = (
  gene: IArrangerEdge<IGeneEntity>,
  orphanetEdges: IArrangerEdge<IGeneOrphanet>[],
) =>
  orphanetEdges.length > 0
    ? {
        conditions: orphanetEdges.map((orphanetNode) => ({
          disorderId: orphanetNode.node.disorder_id,
          panel: orphanetNode.node.panel,
        })),
        gene: gene.node.symbol,
        inheritance: orphanetEdges.map((orphanetNode) => orphanetNode.node.inheritance),
        source: ClinicalGenesTableSource.orphanet,
      }
    : null;

const omimFromEdges = (gene: IArrangerEdge<IGeneEntity>, omimEdges: IArrangerEdge<IGeneOmim>[]) =>
  omimEdges.length > 0
    ? {
        conditions: omimEdges.map((omimNode: IArrangerEdge<IGeneOmim>) => ({
          omimId: omimNode.node.omim_id,
          omimName: omimNode.node.name,
        })),
        gene: [gene.node.symbol, gene.node.omim_gene_id],
        inheritance:
          omimEdges.map((omimNode: IArrangerEdge<IGeneOmim>) => omimNode.node.inheritance) || [],
        source: ClinicalGenesTableSource.omim,
      }
    : null;

const keepOnlyOmimWithId = (arr: IArrangerEdge<IGeneOmim>[]) =>
  arr.filter((omimNode: IArrangerEdge<IGeneOmim>) => omimNode.node.omim_id);

const cosmicFromEdges = (
  gene: IArrangerEdge<IGeneEntity>,
  cosmicEdges: IArrangerEdge<IGeneCosmic>[],
) =>
  cosmicEdges.length > 0
    ? {
        conditions: cosmicEdges
          .map((cosmicNode: IArrangerEdge<IGeneCosmic>) => cosmicNode.node.tumour_types_germline)
          .flat(),
        gene: gene.node.symbol,
        inheritance: '',
        source: ClinicalGenesTableSource.cosmic,
      }
    : null;

const hpoFromEdges = (gene: IArrangerEdge<IGeneEntity>, hpoEdges: IArrangerEdge<IGeneHpo>[]) =>
  hpoEdges.length > 0
    ? {
        conditions: hpoEdges.map((hpoNode: IArrangerEdge<IGeneHpo>) => ({
          hpoTermLabel: hpoNode.node.hpo_term_label,
          hpoTermTermId: hpoNode.node.hpo_term_id,
        })),
        gene: gene.node.symbol,
        inheritance: '',
        source: ClinicalGenesTableSource.hpo,
      }
    : null;

const dddFromEdges = (gene: IArrangerEdge<IGeneEntity>, dddEdges: IArrangerEdge<IGeneDdd>[]) =>
  dddEdges.length > 0
    ? {
        conditions: dddEdges.map((dddNode: IArrangerEdge<IGeneDdd>) => dddNode.node.disease_name),
        gene: gene.node.symbol,
        inheritance: '',
        source: ClinicalGenesTableSource.ddd,
      }
    : null;

export const makeUnGroupedDataRows = (genes: IArrangerEdge<IGeneEntity>[]) => {
  if (!genes.length) {
    return [];
  }

  return genes.map((gene) => {
    const rowOrphanet = orphanetFromEdges(gene, gene.node.orphanet.hits.edges || []);
    const rowOmim = omimFromEdges(gene, keepOnlyOmimWithId(gene.node.omim?.hits?.edges || []));
    const rowCosmic = cosmicFromEdges(gene, gene.node.cosmic?.hits?.edges || []);
    const rowHpo = hpoFromEdges(gene, gene.node.hpo?.hits?.edges || []);
    const rowDdd = dddFromEdges(gene, gene.node.ddd?.hits?.edges || []);

    return [rowOrphanet, rowOmim, rowHpo, rowDdd, rowCosmic].filter((row) => row).flat();
  });
};

export const makeGenesOrderedRow = (genesHits?: IArrangerResultsTree<IGeneEntity>) => {
  const genes = genesHits?.hits?.edges || [];

  if (!genes.length) {
    return [];
  }

  const ungroupedRows = makeUnGroupedDataRows(genes);
  const groupedRows = groupRowsBySource(ungroupedRows);

  return groupedRows.map((row, index) => ({
    conditions: row.conditions as Conditions,
    gene: row.gene,
    inheritance: row.inheritance as Inheritance,
    key: toKebabCase(`${index}-${[row.gene].flat().join('-')}`),
    source: row.source,
  }));
};
