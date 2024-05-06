import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import BarChart from '@ferlab/ui/core/components/Charts/Bar';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import ResizableGridCard from '@ferlab/ui/core/layout/ResizableGridLayout/ResizableGridCard';
import { treeNodeToChartData } from '@ferlab/ui/core/layout/ResizableGridLayout/utils';
import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { isEmpty, uniqBy } from 'lodash';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { getFlattenTree, TreeNode } from 'views/DataExploration/utils/OntologyTree';
import { PhenotypeStore } from 'views/DataExploration/utils/PhenotypeStore';

import { truncateString } from 'utils/string';
import { getResizableGridDictionary } from 'utils/translation';

import { MOST_FREQUENT_PHENOTYPES_ID, UID } from '../utils/grid';

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field: `${field}.name`,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.PARTICIPANT,
  });

const filterPhenotypesData = (data: any[], key = 'label') => {
  let result = data as any[];

  // Exclude zero value
  result = result.filter((item) => item.value > 0);

  // Unique
  result = uniqBy(result, key);

  // Total
  result = result.slice(0, 10);

  return result;
};

const MostFrequentPhenotypesGraphCard = () => {
  const [phenotypes, setPhenotypes] = useState<any>([]);
  const [phenotypesLoading, setPhenotypesLoading] = useState<boolean>(true);

  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);

  // TODO: we should change that after phenotype store refact
  const phenotypeStore = useRef<PhenotypeStore | undefined>(new PhenotypeStore());

  useEffect(() => {
    setPhenotypesLoading(true);
    phenotypeStore.current?.fetch({ field: 'observed_phenotype', sqon }).then(() => {
      setPhenotypesLoading(false);
      const flattenHPOTree = getFlattenTree(phenotypeStore.current?.tree as TreeNode).sort(
        (a, b) => {
          if ((a.exactTagCount ?? 0) > (b.exactTagCount ?? 0)) {
            return -1;
          }
          if ((a.exactTagCount ?? 0) < (b.exactTagCount ?? 0)) {
            return 1;
          }
          return 0;
        },
      );
      setPhenotypes(filterPhenotypesData(treeNodeToChartData(flattenHPOTree)));
    });
  }, [JSON.stringify(sqon)]);

  return (
    <ResizableGridCard
      gridUID={UID}
      id={MOST_FREQUENT_PHENOTYPES_ID}
      theme="shade"
      loading={phenotypesLoading}
      loadingType="spinner"
      dictionary={getResizableGridDictionary()}
      headerTitle={intl.get(
        'screen.dataExploration.tabs.summary.availableData.mostFrequentPhenotypes',
      )}
      tsvSettings={{
        contentMap: ['label', 'value'],
        data: [phenotypes],
        headers: ['Value', 'Count'],
      }}
      modalContent={
        <BarChart
          data={phenotypes}
          axisLeft={{
            legend: intl.get(
              'screen.dataExploration.tabs.summary.mostFrequentPhenotypes.legendAxisLeft',
            ),
            legendPosition: 'middle',
            legendOffset: -120,
            format: (label: string) => {
              const title = label
                .replace(/\(HP:\d+\)/g, '')
                .split('-')
                .pop();
              return truncateString(title ?? '', 15);
            },
          }}
          tooltipLabel={(node: any) => node.data.label}
          axisBottom={{
            legend: 'coucou',
            // legend: intl.get(
            //   'screen.dataExploration.tabs.summary.mostFrequentPhenotypes.legendAxisBottom',
            // ),
            legendPosition: 'middle',
            legendOffset: 35,
          }}
          layout="horizontal"
          margin={{
            bottom: 45,
            left: 130,
            right: 12,
            top: 12,
          }}
        />
      }
      modalSettings={{
        width: 800,
        height: 300,
      }}
      content={
        <>
          {isEmpty(phenotypes) ? (
            <Empty imageType="grid" size="large" noPadding />
          ) : (
            <BarChart
              data={phenotypes}
              axisLeft={{
                legend: intl.get(
                  'screen.dataExploration.tabs.summary.mostFrequentPhenotypes.legendAxisLeft',
                ),
                legendPosition: 'middle',
                legendOffset: -120,
                format: (label: string) => {
                  const title = label
                    .replace(/\(HP:\d+\)/g, '')
                    .split('-')
                    .pop();
                  return truncateString(title ?? '', 15);
                },
              }}
              tooltipLabel={(node: any) => node.data.label}
              axisBottom={{
                legend: intl.get(
                  'screen.dataExploration.tabs.summary.mostFrequentPhenotypes.legendAxisBottom',
                ),
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              layout="horizontal"
              onClick={(datum: any) => addToQuery('observed_phenotype', datum.data.label as string)}
              margin={{
                bottom: 45,
                left: 130,
                right: 12,
                top: 12,
              }}
            />
          )}
        </>
      }
    />
  );
};

export default MostFrequentPhenotypesGraphCard;
