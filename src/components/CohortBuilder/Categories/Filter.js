import React from 'react';
import FieldFilter from '@kfarranger/components/dist/AdvancedSqonBuilder/filterComponents';
import { isReference } from '@kfarranger/components/dist/AdvancedSqonBuilder/utils';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { arrangerProjectId as ARRANGER_PROJECT_ID } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from 'components/CohortBuilder/common';
import { FieldFilterContainer } from 'components/CohortBuilder/FieldFilterContainer';
import { withApi } from 'services/api';
import { sqonShape } from 'shapes';
import { addFilterToSQON } from 'store/sqonUtils';

const fieldsWithCustomIsTaggedQuery = [
  'diagnoses.source_text_diagnosis',
  'diagnoses.ncit_id_diagnosis',
];

/**
 * This component also assumes we are only modifying the first level of sqon
 */
const Filter = compose(withApi)(
  ({
    api,
    initialSqon = {
      op: 'and',
      content: [],
    },
    onSubmit = () => {},
    onCancel = () => {},
    onBack = () => {},
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
      {({ extendedMapping, loading }) => {
        if (loading) {
          return (
            <FieldFilterContainer applyEnabled={false} onCancel={onCancel} onBack={onBack}>
              <Spin />
            </FieldFilterContainer>
          );
        }
        const { type } = extendedMapping[0] || {}; // assume extendedMapping[0] since `field` is provided to ExtendedMappingProvider.
        const contentWithField = initialSqon.content.find((content) => {
          if (!isReference(content)) {
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

        const updatedSqon = fieldsWithCustomIsTaggedQuery.includes(field)
          ? addFilterToSQON(initialSqon, 'diagnoses.is_tagged', ['true'])
          : initialSqon;

        const initializedSqon = {
          ...updatedSqon,
          content: contentWithField
            ? updatedSqon.content
            : [
                ...updatedSqon.content,
                {
                  op: ['id', 'keyword', 'boolean'].includes(type) ? 'in' : 'between',
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
            ContainerComponent={(props) => (
              <FieldFilterContainer {...props} id={field} onBack={onBack} />
            )}
          />
        );
      }}
    </ExtendedMappingProvider>
  ),
);

Filter.propTypes = {
  initialSqon: sqonShape,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onBack: PropTypes.func,
  field: PropTypes.string.isRequired,
  arrangerProjectId: PropTypes.string,
  arrangerProjectIndex: PropTypes.string,
};

export default Filter;
