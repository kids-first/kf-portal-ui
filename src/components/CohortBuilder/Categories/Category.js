import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import noop from 'lodash/noop';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';

import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import Column from 'uikit/Column';
import Dropdown, { withDropdownState } from 'uikit/Dropdown';
import { arrangerProjectId } from 'common/injectGlobals';
import { SQONdiff, styleComponent } from 'components/Utils';
import Filter from './Filter';
import CategoryRowDisplay from './CategoryRowDisplay';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';

const trackCategoryAction = ({ category, subCategory, action, label }) => {
  trackUserInteraction({
    category: `${
      TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
    } - ${category} ${subCategory ? '- ' + subCategory : ''}`,
    action,
    label,
  });
};

/**
 * Flip dropdown side on smaller screens
 */
class OptionsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    const { children } = this.props;
    const boundingRect = this.ref.current && this.ref.current.getBoundingClientRect();
    const shouldFlip = boundingRect
      ? boundingRect.x + boundingRect.width > window.innerWidth
      : false;

    return (
      <div
        className={`cb-category-options ${shouldFlip ? 'shouldFlip' : ''}`}
        ref={el => (this.ref = el)}
      >
        {children}
      </div>
    );
  }
}

const ItemWrapper = styleComponent('div', 'cb-category-ItemWrapper');

const CategoryRow = compose(withApi)(({ api, field, active }) => (
  <ExtendedMappingProvider
    api={api}
    projectId={arrangerProjectId}
    graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
    field={field}
    useCache={true}
  >
    {({ extendedMapping = [] }) => (
      <CategoryRowDisplay
        active={active}
        title={extendedMapping[0] ? extendedMapping[0].displayName : field}
      />
    )}
  </ExtendedMappingProvider>
));

const Category = compose(
  withDropdownState,
  withProps(({ fields, currentSearchField = '', category, currentCategory }) => {
    const index = fields.indexOf(currentSearchField);
    return index > -1 && category === currentCategory
      ? { showExpanded: true, activeIndex: index }
      : {};
  }),
)(
  ({
    title,
    children,
    color,
    toggleDropdown,
    isDropdownVisible,
    setDropdownVisibility,
    activeIndex,
    setExpanded = noop,
    showExpanded,
    fields,
    setActiveCategory,
    sqon = {
      op: 'and',
      content: [],
    },
    onSqonUpdate = noop,
    onClose = noop,
    category = '',
  }) => {
    const isFieldInSqon = fieldId =>
      sqon.content.some(({ content: { field } }) => field === fieldId);

    const currentSQON = sqon;
    const isOpen = isDropdownVisible || activeIndex >= 0;

    return (
      <Dropdown
        {...{
          multiLevel: true,
          onOuterClick: () => {
            setActiveCategory({ category, fieldName: '' });
            setDropdownVisibility(false);
            onClose();
            trackCategoryAction({ category: title, action: 'Close' });
          },
          isOpen,
          onToggle: (...args) => {
            trackCategoryAction({ category: title, action: !isDropdownVisible ? 'Open' : 'Close' });
            toggleDropdown(...args);
          },
          setActiveIndex: index => setActiveCategory({ fieldName: fields[index], category }),
          activeIndex,
          setExpanded,
          showExpanded: showExpanded
            ? (...args) => {
                showExpanded(...args);
                trackCategoryAction({
                  category: title,
                  subCategory: fields[args.item.key],
                  action: 'Open',
                });
              }
            : undefined,
          showArrow: false,
          items: (fields || []).map(field => (
            <CategoryRow active={isFieldInSqon(field)} field={field} />
          )),
          expandedItems: (fields || []).map((field, i) => (
            <Filter
              initialSqon={sqon}
              onSubmit={sqon => {
                let addedSQON = SQONdiff(sqon, currentSQON);
                trackCategoryAction({
                  category: title,
                  action: `${TRACKING_EVENTS.actions.apply} Selected Filters`,
                  label: JSON.stringify({ added_sqon: addedSQON, result_sqon: sqon }),
                });
                onSqonUpdate(sqon);
                setDropdownVisibility(false);
                onClose();
              }}
              onBack={() => {
                onClose();
              }}
              onCancel={() => {
                setDropdownVisibility(false);
                onClose();
              }}
              field={field}
              arrangerProjectId={arrangerProjectId}
              arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
            />
          )),
          ContainerComponent: ({ children, ...props }) => (
            <Column
              {...props}
              style={{
                flex: '1',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: '1px solid #d4d6dd',
                borderTop: `4px solid ${color ? color : 'white'}`,
                position: 'relative',
                whiteSpace: 'nowrap',
                zIndex: '1',
              }}
            >
              {children}
            </Column>
          ),
          ItemWrapperComponent: ItemWrapper,
          OptionsContainerComponent: OptionsWrapper,
        }}
      >
        <Column className={`cb-category-Button ${isOpen ? 'isOpen' : ''}`}>
          {' '}
          {children}
          <h3>{title}</h3>
        </Column>
      </Dropdown>
    );
  },
);

Category.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  sqon: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentSearchField: PropTypes.string,
  onClose: PropTypes.func,
  onSqonUpdate: PropTypes.func,
};

export default Category;
