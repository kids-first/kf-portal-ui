import React from 'react';
import FieldFilter from '@arranger/components/dist/AdvancedSqonBuilder/filterComponents';
import { isReference } from '@arranger/components/dist/AdvancedSqonBuilder/utils';
import ExtendedMappingProvider from '@arranger/components/dist/utils/ExtendedMappingProvider';

import { withApi } from 'services/api';
import { arrangerProjectId as ARRANGER_PROJECT_ID } from 'common/injectGlobals';
import { FieldFilterContainer, ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';

/**
 * Some inversion of control going on here through the `ContainerComponent` prop.
 * This compoponent also assumes we are only modifying the first level of sqon
 */
const Filter = withApi(
  ({
    api,
    initialSqon = {
      op: 'and',
      content: [],
    },
    onSubmit,
    onCancel,
    onBack,
    field,
    arrangerProjectId = ARRANGER_PROJECT_ID,
    arrangerProjectIndex = ARRANGER_API_PARTICIPANT_INDEX_NAME,
  }) => (
    <ExtendedMappingProvider
      api={api}
      projectId={arrangerProjectId}
      graphqlField={arrangerProjectIndex}
      field={field}
      useCache={true}
    >
      {({ extendedMapping }) => {
        const contentWithField = initialSqon.content.find(content => {
          if (isReference(content)) {
            const {
              content: { field: _field },
            } = content;
            return _field === field;
          } else {
            return false;
          }
        });
        const path = [
          contentWithField
            ? initialSqon.content.indexOf(contentWithField)
            : initialSqon.content.length,
        ];
        const initializedSqon = {
          ...initialSqon,
          content: contentWithField
            ? initialSqon.content
            : [
                ...initialSqon.content,
                {
                  op: 'in',
                  content: {
                    field,
                    value: [],
                  },
                },
              ],
        };
        const displayNameMap = (extendedMapping || []).reduce(
          (acc, { field, displayName }) => ({
            ...acc,
            [field]: displayName,
          }),
          {},
        );
        return (
          <FieldFilter
            sqonPath={path}
            initialSqon={initializedSqon}
            onSubmit={onSubmit}
            onCancel={onCancel}
            fieldDisplayNameMap={displayNameMap}
            api={api}
            field={field}
            arrangerProjectId={arrangerProjectId}
            arrangerProjectIndex={arrangerProjectIndex}
            ContainerComponent={props => <FieldFilterContainer {...props} onBack={onBack} />}
          />
        );
      }}
    </ExtendedMappingProvider>
  ),
);

export default Filter;
