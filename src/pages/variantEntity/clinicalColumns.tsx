import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';

import ExpandableCell from 'components/ExpandableCell';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'components/Variants/Empty';
import {
  ClinicalGenesTableSource,
  Conditions,
  CosmicConditions,
  DddConditions,
  HpoCondition,
  HpoConditions,
  Inheritance,
  OmimCondition,
  OmimConditions,
  OmimGene,
  OmimInheritance,
  OrphanetCondition,
  OrphanetConditions,
  OrphanetInheritance,
  SingleValuedInheritance,
} from 'store/graphql/variants/models';
const { Text } = Typography;

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
  source: ClinicalGenesTableSource;
  gene: string | OmimGene;
  conditions: Conditions;
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
    render: (text: Conditions, record: Record) => {
      const source = record.source;
      if (source === ClinicalGenesTableSource.omim) {
        const [geneName, omimId] = record.gene as OmimGene;
        return (
          <>
            <Text>{geneName}</Text> &nbsp; (MIM:
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.omim.org/entry/${omimId}`}
            >
              {omimId}
            </a>
            )
          </>
        );
      }
      return record.gene;
    },
  },
  {
    title: 'Condition',
    dataIndex: 'conditions',
    // eslint-disable-next-line react/display-name
    render: (text: Conditions, record: Record) => {
      const source = record.source;
      if (source === ClinicalGenesTableSource.omim) {
        const omimConditions = record.conditions as OmimConditions;
        if (omimConditions.length === 0) {
          return <></>;
        }
        return (
          <div>
            {omimConditions.map((omimCondition: OmimCondition, index: number) => {
              const geneOmimName = omimCondition.omimName || DISPLAY_WHEN_EMPTY_DATUM;
              const omimId = omimCondition.omimId;

              return (
                <StackLayout key={index}>
                  <Text>{geneOmimName}</Text> &nbsp; (MIM:
                  <a
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.omim.org/entry/${omimId}`}
                  >
                    {omimId}
                  </a>
                  )
                </StackLayout>
              );
            })}
          </div>
        );
      } else if (source === ClinicalGenesTableSource.orphanet) {
        const orphanetConditions = record.conditions as OrphanetConditions;
        if (orphanetConditions.length === 0) {
          return <></>;
        }

        return (
          <div>
            {orphanetConditions.map((orphanetItem: OrphanetCondition, index: number) => {
              const panel = orphanetItem.panel;
              const disorderId = orphanetItem.disorderId;
              return (
                <StackLayout key={index}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      'https://www.orpha.net/consor/cgi-bin/Disease_Search.php' +
                      `?lng=EN&data_id=1738&Disease_Disease_Search_diseaseGroup=${disorderId}`
                    }
                  >
                    {panel}
                  </a>
                </StackLayout>
              );
            })}
          </div>
        );
      } else if (source === ClinicalGenesTableSource.hpo) {
        const hpoConditions = record.conditions as HpoConditions;
        return (
          <ExpandableCell
            dataSource={hpoConditions || []}
            renderItem={(hpoItem, id) => {
              const item = hpoItem as HpoCondition;

              const termLabel = item.hpoTermLabel || '';
              const termId = item.hpoTermTermId;

              // expects: aLabel (HP:xxxxxx)
              const split = termLabel.split('(');
              const condition = split[0];

              return (
                <StackLayout key={id}>
                  <Text>{condition}</Text> &nbsp; (
                  <a
                    key={id}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://hpo.jax.org/app/browse/term/${termId}`}
                  >
                    {termId}
                  </a>
                  )
                </StackLayout>
              );
            }}
          />
        );
      } else if (source === ClinicalGenesTableSource.ddd) {
        const dddConditions = record.conditions as DddConditions;
        if (dddConditions.length === 0) {
          return <></>;
        }
        return dddConditions.map((dddCondition, index: number) => (
          <StackLayout key={index}>
            <Text>{dddCondition}</Text>
          </StackLayout>
        ));
      }
      //Cosmic
      const comicConditions = record.conditions as CosmicConditions;
      if (comicConditions.length === 0) {
        return <></>;
      }

      return (
        <div>
          {comicConditions.map((cosmicCondition, index: number) => (
            <StackLayout key={index}>
              <Text>{cosmicCondition}</Text>
            </StackLayout>
          ))}
        </div>
      );
    },
    width: '35%',
  },
  {
    title: 'Inheritance',
    dataIndex: 'inheritance',
    render: (text: Inheritance, record: Record) => {
      const source = record.source;
      if (source === ClinicalGenesTableSource.orphanet) {
        const orphanetInheritance = (record.inheritance || []) as OrphanetInheritance;
        return (
          <>
            {orphanetInheritance.map((inheritance: string[], index: number) => (
              <StackLayout key={index}>
                <Text>{inheritance ? inheritance.join(',') : DISPLAY_WHEN_EMPTY_DATUM}</Text>
              </StackLayout>
            ))}
          </>
        );
      } else if (source === ClinicalGenesTableSource.omim) {
        const omimInheritance = record.inheritance as OmimInheritance;
        return (
          <>
            {omimInheritance.map((inheritance: string[], index: number) => (
              <StackLayout key={index}>
                <Text>{inheritance ? inheritance.join(',') : DISPLAY_WHEN_EMPTY_DATUM}</Text>
              </StackLayout>
            ))}
          </>
        );
      }
      const inheritance = record.inheritance as SingleValuedInheritance;
      return inheritance || DISPLAY_WHEN_EMPTY_DATUM;
    },
    width: '35%',
  },
];
