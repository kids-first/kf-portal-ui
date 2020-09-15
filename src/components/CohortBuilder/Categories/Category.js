import React, { Fragment } from 'react';
import { connect } from 'react-redux';
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
import { openModal } from 'store/actions/modal';

import '../CohortBuilder.css';
import { supportOntologyBrowser } from 'components/OntologyBrowser/OntologyBrowser';
class Category extends React.Component {
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
    children: PropTypes.element.isRequired,
    anchorId: PropTypes.node.isRequired,
    showOntologyModal: PropTypes.bool,
    onOpenModal: PropTypes.func,
  };

  handleDropdownVisibleChange(visible) {
    this.setState({ visible });
  }

  handleMenuItemSelected(selectedField) {
    if (selectedField === 'observed_phenotype.name') {
      this.props.onOpenModal(selectedField);
      this.setState({
        selectedField: selectedField,
        visible: false,
      });
    } else {
      this.setState({
        selectedField: selectedField,
        visible: true,
      });
    }
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
        onSubmit={(sqon) => {
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
    const { children, title, color, anchorId } = this.props;
    const { visible, selectedField } = this.state;
    const showOntologyBrowser = supportOntologyBrowser(selectedField);

    return (
      <Fragment>
        <ExtendedMappingProvider
          projectId={arrangerProjectId}
          graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        >
          {({ extendedMapping = [] }) => {
            let overlay = <div />;

            overlay =
              selectedField && !showOntologyBrowser
                ? this.renderFilter(selectedField, title)
                : this.renderMenu(extendedMapping);

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

const mapDispatchToProps = (dispatch) => ({
  onOpenModal: (id) => {
    dispatch(openModal(id));
  },
});

export default connect(null, mapDispatchToProps)(Category);
