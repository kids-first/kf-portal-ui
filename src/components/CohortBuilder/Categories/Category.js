import React from 'react';
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

export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedField: null,
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

  componentDidMount() {
    this.setState({
      visible: false,
      selectedField: null,
    });
  }

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
          onSqonUpdate(title, sqon);
          this.handleCloseFilter(false);
        }}
        onBack={() => {
          this.handleCloseFilter(true);
        }}
        onCancel={() => {
          this.handleCloseFilter(false);
        }}
        field={field}
        arrangerProjectId={arrangerProjectId}
        arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
      />
    );
  }

  render() {
    const { children, title, color } = this.props;
    const { visible, selectedField } = this.state;

    return (
      <ExtendedMappingProvider
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
      >
        {({ extendedMapping = [] }) => {
          const overlay = selectedField
            ? this.renderFilter(selectedField, title)
            : this.renderMenu(extendedMapping);

          return (
            <Dropdown
              overlay={overlay}
              trigger={['click']}
              visible={visible}
              onVisibleChange={this.handleDropdownVisibleChange}
              overlayClassName="cb-category-overlay-container"
            >
              <Column className="cb-category-button" style={{ borderTopColor: color }}>
                {children}
                <h3>{title}</h3>
              </Column>
            </Dropdown>
          );
        }}
      </ExtendedMappingProvider>
    );
  }
}
