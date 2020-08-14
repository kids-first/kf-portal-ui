import React, { useState, Fragment } from 'react';
import { AdvancedFacetView } from '@kfarranger/components/dist/Arranger';
import { ModalFooter } from '../Modal';
import { FilterInput } from 'uikit/Input';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import './style.css';
import PropTypes from 'prop-types';

const CustomFilterInput = ({ children, style = {}, ...props }) => (
  <FilterInput style={{ width: 'auto', ...style }} {...props}>
    {children}
  </FilterInput>
);

CustomFilterInput.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

const AdvancedFacetViewModalContent = (props) => {
  const {
    closeModal,
    onSqonSubmit,
    trackFileRepoInteraction,
    sqon,
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
  } = props;

  const [modalSqon, setModalSqon] = useState(sqon);

  return (
    <Fragment>
      <div className="afv-container">
        <AdvancedFacetView
          projectId={projectId}
          fetchData={fetchData}
          graphqlField={graphqlField}
          index={index}
          statsConfig={statsConfig}
          translateSQONValue={translateSQONValue}
          InputComponent={CustomFilterInput}
          sqon={modalSqon}
          onSqonChange={({ sqon }) => {
            setModalSqon(sqon);
          }}
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
      </div>
      <ModalFooter
        {...{
          unsetModal: closeModal,
          handleSubmit: () => onSqonSubmit({ sqon: modalSqon }),
          submitText: 'View Results',
        }}
      />
    </Fragment>
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
};

export default AdvancedFacetViewModalContent;
