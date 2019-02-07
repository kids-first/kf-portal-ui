import React from 'react';
import FieldFilter from '@arranger/components/dist/AdvancedSqonBuilder/filterComponents';
import { isReference } from '@arranger/components/dist/AdvancedSqonBuilder/utils';
import { withApi } from 'services/api';

import { FieldFilterContainer } from '../common';

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
    arrangerProjectId = arrangerProjectId,
    arrangerProjectIndex = 'participant',
  }) => {
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
      contentWithField ? initialSqon.content.indexOf(contentWithField) : initialSqon.content.length,
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
    return (
      <FieldFilter
        sqonPath={path}
        initialSqon={initializedSqon}
        onSubmit={onSubmit}
        onCancel={onCancel}
        fieldDisplayNameMap={{}}
        api={api}
        field={field}
        arrangerProjectId={arrangerProjectId}
        arrangerProjectIndex={arrangerProjectIndex}
        ContainerComponent={props => <FieldFilterContainer {...props} onBack={onBack} />}
      />
    );
  },
);

export default Filter;
