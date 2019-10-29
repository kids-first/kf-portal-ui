import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
import { withApi } from 'services/api';
import Column from 'uikit/Column';
import { compose, lifecycle, withState, withProps } from 'recompose';
import Dropdown, { withDropdownState } from 'uikit/Dropdown';
import Filter from './Filter';
import { SQONdiff } from '../../Utils';
import CategoryRowDisplay from './CategoryRowDisplay';
import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const trackCategoryAction = ({ category, subCategory, action, label }) => {
  trackUserInteraction({
    category: `${
      TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
    } - ${category} ${subCategory ? '- ' + subCategory : ''}`,
    action,
    label,
  });
};

const Container = styled(Column)`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.greyScale8};
  border-top: 4px solid ${({ color }) => (color ? color : 'white')};
  position: relative;
  white-space: nowrap;
  z-index: 1;
`;

/**
 * Flip dropdown side on smaller screens
 */
const OptionsWrapper = compose(
  withState('shouldFlip', 'setShouldFlip', false),
  withProps(() => ({
    optionsRef: React.createRef(),
  })),
  lifecycle({
    componentDidMount() {
      const { optionsRef, setShouldFlip } = this.props;
      const boundingRect = optionsRef.current.getBoundingClientRect();
      const shouldFlip = boundingRect.x + boundingRect.width > window.innerWidth;
      setShouldFlip(shouldFlip);
    },
  }),
)(({ children, optionsRef, shouldFlip }) => (
  <Options innerRef={optionsRef} shouldFlip={shouldFlip}>
    {children}
  </Options>
));

const Options = styled('div')`
  ${({ shouldFlip }) =>
    shouldFlip
      ? css`
          right: 0;
        `
      : css`
          left: 0;
        `};

  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  cursor: pointer;
  text-align: left;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 5.9px 0.1px #bbbbbb;

  > div:not(:last-child) {
    border-bottom: 1px solid #d4d6dd;
  }
`;

const ItemWrapper = styled('div')`
  display: flex;
  padding: 8px 20px;
  font-size: 12px;
  color: #343434;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundGrey};
  }
`;

const Title = styled('h3')`
  margin: 7px 0 0 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.default}, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.filterPurple};
`;

const CategoryButton = styled(Column)`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundGrey};
  }

  ${({ isOpen, theme }) =>
    isOpen
      ? css`
          background-color: ${theme.backgroundGrey};
          box-shadow: 0 0 5.9px 0.1px ${theme.lighterShadow};
        `
      : null}
`;

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

const noop = () => {};

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
            <Container {...props} color={color}>
              {children}
            </Container>
          ),
          ItemWrapperComponent: ItemWrapper,
          OptionsContainerComponent: OptionsWrapper,
        }}
      >
        <CategoryButton isOpen={isOpen}>
          <Column alignItems="center">
            {' '}
            {children}
            <Title> {title}</Title>
          </Column>
        </CategoryButton>
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
