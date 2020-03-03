import React from 'react';
import { AggregationsList } from '@kfarranger/components/dist/Arranger';
import QuickSearchBox from './QuickSearchBox';
import { FilterInput } from '../../../uikit/Input';

const QUICKSEARCH_FIELDS = {
  FILE: [
    {
      header: 'Search by File ID',
      entityField: '', // "" denotes root level entity
      uploadableField: 'kf_id',
      inputPlaceholder: 'Eg. GF_851CMY87',
    },
  ],
  CLINICAL: [
    {
      header: 'Search Files by Biospecimen ID',
      entityField: 'participants.biospecimens',
      uploadableField: 'participants.biospecimens.kf_id',
      inputPlaceholder: 'Eg. BS_4F9171D5, S88-3',
    },
    {
      header: 'Search Files by Participant ID',
      entityField: 'participants',
      uploadableField: 'participants.kf_id',
      inputPlaceholder: 'Eg. PT_RR05KSJC',
    },
  ],
};

const Tab = ({
  aggs,
  type,
  setSQON,
  api,
  sqon,
  onValueChange = () => {},
  projectId,
  containerRef,
  graphqlField,
  translateSQONValue,
}) => {
  const customItems = QUICKSEARCH_FIELDS[type].map(
    ({ entityField, header, uploadableField, inputPlaceholder, modalTitle }, i) => ({
      index: aggs.length,
      component: () => (
        <QuickSearchBox
          key={`${entityField}_${i}`}
          uploadableFields={[uploadableField]}
          inputPlaceholder={inputPlaceholder}
          whitelist={[entityField]}
          matchboxPlaceholderText={inputPlaceholder}
          {...{
            modalTitle,
            graphqlField,
            header,
            setSQON,
            translateSQONValue,
            projectId,
          }}
        />
      ),
    }),
  );

  return (
    <AggregationsList
      {...{
        onValueChange: onValueChange,
        setSQON: setSQON,
        sqon,
        projectId,
        graphqlField,
        api,
        containerRef,
        aggs,
        debounceTime: 300,
        componentProps: {
          getTermAggProps: () => ({
            InputComponent: FilterInput,
            headerTitle: '# files',
          }),
        },
        getCustomItems: () => customItems,
      }}
    />
  );
};

export default Tab;
