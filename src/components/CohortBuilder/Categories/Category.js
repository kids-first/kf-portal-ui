import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';
import { Dropdown } from 'antd';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';

import { sqonShape } from 'shapes';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import Column from 'uikit/Column';
import { arrangerProjectId } from 'common/injectGlobals';
import { SQONdiff } from 'components/Utils';
import Filter from './Filter';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';

import CategoryMenu from './CategoryMenu';

import '../CohortBuilder.css';

const trackCategoryAction = ({ category, subCategory, action, label }) => {
  trackUserInteraction({
    category: `${
      TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
    } - ${category} ${subCategory ? '- ' + subCategory : ''}`,
    action,
    label,
  });
};

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
    onClose: PropTypes.func.isRequired,
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
    this.props.onClose();
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
          const addedSQON = SQONdiff(sqon, this.initialSqon);
          trackCategoryAction({
            category: title,
            action: `${TRACKING_EVENTS.actions.apply} Selected Filters`,
            label: JSON.stringify({ added_sqon: addedSQON, result_sqon: sqon }),
          });
          this.initialSqon = sqon;
          onSqonUpdate(sqon);
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
    // TODO: either replace `children` by `Icon` and `iconProps`,
    //  or let `children` be the whole content of `Dropdown`
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
