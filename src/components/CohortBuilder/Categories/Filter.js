import React from 'react';
import FieldFilter from '@arranger/components/dist/AdvancedSqonBuilder/filterComponents';
import { withApi } from 'services/api';

import { FieldFilterContainer } from '../common';

/**
 * Some inversion of control going on here through the `ContainerComponent` prop
 */
const Filter = withApi(
  ({
    api,
    initialSqon,
    onSubmit,
    onCancel,
    onBack,
    field,
    arrangerProjectId = arrangerProjectId,
    arrangerProjectIndex = 'participant',
  }) => (
    <FieldFilter
      sqonPath={[0]}
      initialSqon={initialSqon}
      onSubmit={onSubmit}
      onCancel={onCancel}
      fieldDisplayNameMap={{}}
      api={api}
      field={field}
      arrangerProjectId={arrangerProjectId}
      arrangerProjectIndex={arrangerProjectIndex}
      ContainerComponent={props => <FieldFilterContainer {...props} onBack={onBack} />}
    />
  ),
);

export default Filter;
