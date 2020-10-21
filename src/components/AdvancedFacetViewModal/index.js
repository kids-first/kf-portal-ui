import React from 'react';
import { AdvancedFacetView } from '@kfarranger/components/dist/Arranger';
import { FilterInput } from 'uikit/Input';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import PropTypes from 'prop-types';
import './style.css';

const CustomFilterInput = ({ children, style = {}, ...props }) => (
  <FilterInput style={{ width: 'auto', ...style }} {...props}>
    {children}
  </FilterInput>
);

CustomFilterInput.propTypes = {
  children: PropTypes.element,
  style: PropTypes.object,
};

const AdvancedFacetViewModalContent = (props) => {
  const {
    trackFileRepoInteraction,
    index,
    graphqlField,
    projectId,
    statsConfig,
    translateSQONValue,
    fetchData,
    onClear,
    onTermSelected,
    onFilterChange,
    onFacetNavigation,
    onSqonChange,
    sqon,
  } = props;

  return (
    <AdvancedFacetView
      projectId={projectId}
      fetchData={fetchData}
      graphqlField={graphqlField}
      index={index}
      statsConfig={statsConfig}
      translateSQONValue={translateSQONValue}
      InputComponent={CustomFilterInput}
      sqon={sqon}
      onSqonChange={onSqonChange}
      onFacetNavigation={(path) => {
        trackFileRepoInteraction({
          category: `${TRACKING_EVENTS.categories.fileRepo.filters} - Advanced`,
          action: `${TRACKING_EVENTS.actions.click} side navigation`,
          label: path,
        });
        if (onFacetNavigation) {
          onFacetNavigation(path);
        }
      }}
      onFilterChange={(val) => {
        if (val !== '') {
          trackFileRepoInteraction({
            category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
            action: `${TRACKING_EVENTS.actions.filter} - Search`,
            ...(val && { label: val }),
          });
          if (onFilterChange) {
            onFilterChange(val);
          }
        }
      }}
      onTermSelected={({ field, value, active, ...rest }) => {
        if (active) {
          trackFileRepoInteraction({
            category: `${TRACKING_EVENTS.categories.fileRepo.filters} - Advanced`,
            action: `${TRACKING_EVENTS.actions.filter} Selected`,
            label: {
              type: 'filter',
              value,
              field,
            },
          });
        }
        if (onTermSelected) {
          onTermSelected({ field, value, active, ...rest });
        }
      }}
      onClear={() => {
        trackFileRepoInteraction({
          category: `${TRACKING_EVENTS.categories.fileRepo.filters} - Advanced`,
          action: TRACKING_EVENTS.actions.query.clear,
        });
        if (onClear) {
          onClear();
        }
      }}
    />
  );
};

AdvancedFacetViewModalContent.propTypes = {
  statsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isRoot: PropTypes.bool,
      icon: PropTypes.object,
      field: PropTypes.string,
      dataAccessor: PropTypes.string,
      store: PropTypes.object,
    }),
  ),
  closeModal: PropTypes.func,
  onSqonSubmit: PropTypes.func,
  trackFileRepoInteraction: PropTypes.func,
  sqon: PropTypes.object,
  index: PropTypes.string.isRequired,
  graphqlField: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  translateSQONValue: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onTermSelected: PropTypes.func,
  onFilterChange: PropTypes.func,
  onFacetNavigation: PropTypes.func,
  onSqonChange: PropTypes.func,
};

export default AdvancedFacetViewModalContent;
