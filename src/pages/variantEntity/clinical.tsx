import {
  Cosmic,
  Ddd,
  Gene,
  Hpo,
  Omim,
  Orphanet,
  HitsEdges,
  ClinVar,
  Condition,
  OrphanetCondition,
  OmimGene,
  DddCondition,
  Inheritance,
  OrphanetInheritance,
  OmimCondition,
  OmimInheritance,
  HpoCondition,
  CosmicCondition,
} from 'store/graphql/variants/models';
import { toKebabCase } from 'utils';
import React from 'react';
import ExpandableCell from 'components/ExpandableCell';

export enum Source {
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
        condition: cosmicNodeEdges
          .map((cosmicNode: Cosmic) => cosmicNode.node.tumour_types_germline)
          .flat(),
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
  const dddRows = ungroupedDataTable.flat().filter((row) => row.source === Source.ddd);
  const cosmicRows = ungroupedDataTable.flat().filter((row) => row.source === Source.cosmic);
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
    condition: row.condition as Condition,
    inheritance: row.inheritance as Inheritance,
    key: toKebabCase(`${index}-${[row.gene].flat().join('-')}`),
  }));
};

export const columnsClinVar = [
  {
    title: 'Interpretation',
    dataIndex: 'interpretation',
  },
  {
    title: 'Condition',
    dataIndex: 'condition',
    width: '25%',
  },
  {
    title: 'Inheritance',
    dataIndex: 'inheritance',
    width: '25%',
  },
];

type Record = {
  source: Source;
  gene: string | OmimGene;
  condition: Condition | OmimCondition;
  inheritance: Inheritance;
};

export const columnsPhenotypes = [
  {
    title: 'Source',
    dataIndex: 'source',
  },
  {
    title: 'Gene',
    dataIndex: 'gene',
    render: (text: Condition, record: Record) => {
      const source = record.source;
      if (source === Source.omim) {
        const [geneName, omimId] = record.gene as OmimGene;
        return (
          <span>
            {geneName} ( MIM: &nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.omim.org/entry/${omimId}`}
            >
              {omimId}
            </a>
            &nbsp; )
          </span>
        );
      }
      return record.gene;
    },
  },
  {
    title: 'Condition',
    dataIndex: 'condition',
    // eslint-disable-next-line react/display-name
    render: (text: Condition, record: Record) => {
      const source = record.source;
      if (source === Source.omim) {
        const omimCondition = record.condition as OmimCondition;
        const omimConditions = omimCondition.map(([geneOmimName, omimId], index: number) => (
          <span key={index}>
            {geneOmimName} ( MIM: &nbsp;
            <a
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.omim.org/entry/${omimId}`}
            >
              {omimId}
            </a>
            &nbsp; )
          </span>
        ));
        return <ExpandableCell dataSource={omimConditions} />;
      } else if (source === Source.orphanet) {
        const orphanetConditions = record.condition as OrphanetCondition;
        const orphanetCondtions = orphanetConditions.map(([panel, diseaseId], index: number) => (
          <a
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            href={
              'https://www.orpha.net/consor/cgi-bin/Disease_Search.php' +
              `?lng=EN&data_id=1738&Disease_Disease_Search_diseaseGroup=${diseaseId}`
            }
          >
            {panel}
          </a>
        ));
        return <ExpandableCell dataSource={orphanetCondtions} />;
      } else if (source === Source.hpo) {
        const hpoCondition = record.condition as HpoCondition;
        const hpoConditions = hpoCondition.map(([termLabel, termId], index: number) => {
          const split = termLabel.split('(');
          const condition = split[0];
          return (
            <span key={index}>
              {condition}(
              <a
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://hpo.jax.org/app/browse/term/${termId}`}
              >
                {termId}
              </a>
              )
            </span>
          );
        });
        return <ExpandableCell dataSource={hpoConditions} />;
      } else if (source === Source.ddd) {
        const dddCondition = record.condition as DddCondition;
        return <ExpandableCell dataSource={dddCondition} />;
      }
      //Cosmic
      const comicCondition = record.condition as CosmicCondition;
      return <ExpandableCell dataSource={comicCondition} />;
    },
    width: '25%',
  },
  {
    title: 'Inheritance',
    dataIndex: 'inheritance',
    render: (text: Inheritance, record: Record) => {
      const source = record.source;
      if (source === Source.orphanet) {
        const orphanetInheritance = (record.inheritance || []) as OrphanetInheritance;
        return <ExpandableCell dataSource={orphanetInheritance.filter((e) => e)} />;
      } else if (source === Source.omim) {
        const omimInheritance = record.inheritance as OmimInheritance;
        return <ExpandableCell dataSource={omimInheritance} />;
      }
      return record.inheritance;
    },
    width: '25%',
  },
];
