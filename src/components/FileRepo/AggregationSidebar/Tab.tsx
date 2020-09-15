/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
// @ts-ignore
import { AggregationsList, AggsWrapper } from '@kfarranger/components/dist/Arranger';
import { FilterInput } from 'uikit/Input';
import EntityFilesSearchInput from './EntityFileSearchFilter';
import { EntityName } from 'store/fileSearchFiltersTypes';
import UploadIdsButton from './UploadIdsButton';
import { setSqonArrangerCB, Sqon } from 'store/sqon';
import { EsIndex, ProjectId } from 'store/esTypes';
import { AggsState } from 'store/ArrangerTypes';

type Props = {
  aggs: AggsState;
  type: string;
  setSQON: setSqonArrangerCB;
  api: Function;
  sqon: Sqon;
  onValueChange: Function;
  projectId: ProjectId;
  containerRef: React.RefObject<HTMLInputElement>;
  graphqlField: string;
  index: EsIndex;
};

const getTermAggProps = () => ({
  InputComponent: FilterInput,
  headerTitle: '# files',
});

const Tab: FunctionComponent<Props> = ({
  aggs,
  type,
  setSQON,
  api,
  sqon,
  onValueChange = () => {},
  projectId,
  containerRef,
  graphqlField,
  index,
}) => {
  const isClinicalTab = type === 'CLINICAL';
  const isFileTab = type === 'FILE';

  return (
    <>
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
            getTermAggProps,
          },
        }}
      />
      {isClinicalTab && (
        <>
          <AggsWrapper displayName={'Search Files by Participant ID'}>
            <EntityFilesSearchInput
              key={`clinical-participant-id`}
              entityName={EntityName.PARTICIPANT}
              setSqon={setSQON}
              placeholder={'Eg. PT_RR05KSJC'}
            />
            <UploadIdsButton
              {...{
                setSQON,
                uploadableFields: ['participants.kf_id'],
                graphqlField,
                index,
                matchboxPlaceholderText: 'Eg. PT_RR05KSJC',
                projectId,
                whitelist: ['participants'],
                id: 'participants',
              }}
            />
          </AggsWrapper>
          <AggsWrapper displayName={'Search Files by Biospecimen ID'}>
            <EntityFilesSearchInput
              key={`clinical-biospecimen-id`}
              entityName={EntityName.BIOSPECIMEN}
              setSqon={setSQON}
              placeholder={'Eg. BS_4F9171D5, S88-3'}
            />
            <UploadIdsButton
              {...{
                setSQON,
                uploadableFields: ['participants.biospecimens.kf_id'],
                graphqlField,
                index,
                matchboxPlaceholderText: 'Eg. BS_4F9171D5, S88-3',
                projectId,
                whitelist: ['participants.biospecimens'],
                id: 'biospecimens',
              }}
            />
          </AggsWrapper>
        </>
      )}
      {isFileTab && (
        <AggsWrapper displayName={'Search by File ID'}>
          <EntityFilesSearchInput
            key={`file-file-id`}
            entityName={EntityName.FILE}
            setSqon={setSQON}
            placeholder={'Eg. GF_851CMY87'}
          />
          <UploadIdsButton
            {...{
              setSQON,
              uploadableFields: ['kf_id'],
              graphqlField,
              index,
              matchboxPlaceholderText: 'Eg. GF_851CMY87',
              projectId,
              whitelist: [''],
              id: 'file',
            }}
          />
        </AggsWrapper>
      )}
    </>
  );
};

export default Tab;
