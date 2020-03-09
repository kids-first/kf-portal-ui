import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';
import { Dropdown } from 'antd';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';

import { sqonShape } from 'shapes';
import Column from 'uikit/Column';
import { arrangerProjectId } from 'common/injectGlobals';
import Filter from './Filter';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';
import CategoryMenu from './CategoryMenu';

import '../CohortBuilder.css';
import OntologyModal from '../../OntologyBrowser';

export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedField: null,
      isOntologyModalVisible: false,
    };
    this.initialSqon = props.sqon;
    autobind(this);
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    sqon: sqonShape.isRequired,
    color: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSqonUpdate: PropTypes.func.isRequired,
  };

  handleDropdownVisibleChange(visible) {
    this.setState({ visible });
  }

  handleMenuItemSelected(selectedField) {
    this.setState({ selectedField });
  }

  handleCloseFilter(keepCategoryOpen = false) {
    this.setState({
      selectedField: null,
      visible: keepCategoryOpen,
    });
  }

  onOntologyClicked = () => {
    const isModalVisible = true;
    this.setState({
      isOntologyModalVisible: isModalVisible,
      visible: !isModalVisible,
    });
  };

  onOntologyModalClose = () => {
    this.setState({
      isOntologyModalVisible: false,
      visible: true,
    });
  };

  renderMenu(extendedMapping) {
    const { fields, sqon } = this.props;
    return (
      <CategoryMenu
        fields={fields}
        sqon={sqon}
        extendedMapping={extendedMapping}
        onMenuItemSelected={this.handleMenuItemSelected}
      />
    );
  }

  renderFilter(field, title = field) {
    if (!field) return null;

    const { sqon, onSqonUpdate } = this.props;
    return (
      <Filter
        initialSqon={sqon}
        onSubmit={sqon => {
          console.log('onsubmit : ', sqon, ' title ', title);
          onSqonUpdate(title, sqon);
          this.handleCloseFilter(false);
        }}
        onBack={() => {
          this.handleCloseFilter(true);
        }}
        onCancel={() => {
          this.handleCloseFilter(false);
        }}
        showOntologyBrowserButton={field === 'phenotype.hpo_phenotype_observed'}
        onOntologyClicked={this.onOntologyClicked}
        field={field}
        arrangerProjectId={arrangerProjectId}
        arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
      />
    );
  }

  render() {
    const { children, title, color, anchorId, sqon, onSqonUpdate } = this.props;
    const { isOntologyModalVisible, visible, selectedField } = this.state;
    return (
      <Fragment>
        {selectedField === 'phenotype.hpo_phenotype_observed' && (
          <OntologyModal
            isVisible={isOntologyModalVisible}
            onCloseModal={this.onOntologyModalClose}
            initialSqon={sqon}
            onSqonUpdate={sqon => {
              onSqonUpdate(title, sqon);
              this.handleCloseFilter(false);
            }}
            title={title}
          />
        )}

        <ExtendedMappingProvider
          projectId={arrangerProjectId}
          graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        >
          {({ extendedMapping = [] }) => {
            let overlay = <div />;

            if (!isOntologyModalVisible) {
              overlay = selectedField
                ? this.renderFilter(selectedField, title)
                : this.renderMenu(extendedMapping);
            }

            return (
              <Dropdown
                overlay={overlay}
                trigger={['click']}
                visible={visible}
                onVisibleChange={this.handleDropdownVisibleChange}
                overlayClassName="cb-category-overlay-container"
                getPopupContainer={() => document.getElementById(anchorId)}
              >
                <Column
                  id={anchorId}
                  className="cb-category-button"
                  style={{ borderTopColor: color, position: 'relative' }}
                >
                  {children}
                  <h3>{title}</h3>
                </Column>
              </Dropdown>
            );
          }}
        </ExtendedMappingProvider>
      </Fragment>
    );
  }
}
