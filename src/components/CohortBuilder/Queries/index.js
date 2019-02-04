import React from 'react';
import styled from 'react-emotion';
import { memoize } from 'lodash';
import AdvancedSqonBuilder from '@arranger/components/dist/AdvancedSqonBuilder';
import ExtendedMappingProvider from '@arranger/components/dist/utils/ExtendedMappingProvider';
import { withApi } from 'services/api';
import { arrangerProjectId } from 'common/injectGlobals';

const extendedMappingToDisplayNameMap = memoize(extendedMapping =>
  extendedMapping.reduce((acc, { field, displayName }) => {
    acc[field] = displayName;
    return acc;
  }, {}),
);

const SqonBuilderContainer = styled('div')`
  > .sqonBuilder .sqonEntry .actionButtonsContainer {
    box-sizing: border-box;
  }
`;

/**
 * this component should mimic the AdvancedSqonBuilder's API directly
 **/
export default withApi(({ api, ...rest }) => {
  const ARRANGER_API_PARTICIPANT_INDEX_NAME = 'participant';
  const onSqonRemoveClick = ({ indexToRemove, dependentIndices }) => {
    if (dependentIndices.length) {
      return window.confirm(`Are you sure you want to remove query #${indexToRemove} ?`)
        ? Promise.resolve()
        : Promise.reject();
    } else {
      return Promise.resolve();
    }
  };
  return (
    <SqonBuilderContainer>
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading, extendedMapping }) =>
          loading ? (
            'loading'
          ) : (
            <AdvancedSqonBuilder
              api={api}
              arrangerProjectId={arrangerProjectId}
              arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
              getSqonDeleteConfirmation={onSqonRemoveClick}
              fieldDisplayNameMap={extendedMappingToDisplayNameMap(extendedMapping)}
              {...rest}
            />
          )
        }
      </ExtendedMappingProvider>
    </SqonBuilderContainer>
  );
});
