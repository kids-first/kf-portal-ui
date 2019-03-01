import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import ExtendedMappingProvider from '@arranger/components/dist/utils/ExtendedMappingProvider';
import { withApi } from 'services/api';
import Column from 'uikit/Column';
import Dropdown from 'uikit/Dropdown';
import { compose, lifecycle, withState, withProps } from 'recompose';
import { withDropdownMultiPane } from 'uikit/Dropdown';
import Filter from './Filter';
import CategoryRowDisplay from './CategoryRowDisplay';
import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';
import { withSize } from 'react-sizeme';
import { setSqonAtPath } from '@arranger/components/dist/AdvancedSqonBuilder/utils';

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
    dropdownRef: React.createRef(),
  })),
  lifecycle({
    componentDidMount() {
      const { dropdownRef, setShouldFlip } = this.props;
      const boundingRect = dropdownRef.current.getBoundingClientRect();
      const shouldFlip = boundingRect.x + boundingRect.width > window.innerWidth;
      setShouldFlip(shouldFlip);
    },
  }),
)(({ children, dropdownRef: optionsRef, shouldFlip }) => (
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
  padding: 5px 10px 5px 23px;
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

  ${({ isDropdownVisible, theme }) =>
    isDropdownVisible
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

const Category = compose(withDropdownMultiPane)(
  ({
    title,
    children,
    color,
    toggleDropdown,
    isDropdownVisible,
    setDropdownVisibility,
    toggleExpanded,
    toggleExpandedDropdown,
    setActiveIndex,
    activeIndex,
    setExpanded,
    showExpanded,
    fields,
    sqon = {
      op: 'and',
      content: [],
    },
    onSqonUpdate,
  }) => {
    const isFieldInSqon = fieldId =>
      sqon.content.some(({ content: { field } }) => field === fieldId);
    return (
      <Dropdown
        {...{
          multiLevel: true,
          onOuterClick: () => {
            setExpanded(false);
            setDropdownVisibility(false);
          },
          isOpen: isDropdownVisible,
          onToggle: toggleDropdown,
          setActiveIndex,
          activeIndex,
          setExpanded,
          showExpanded,
          showArrow: false,
          items: (fields || []).map((field, i) => (
            <CategoryRow active={isFieldInSqon(field)} field={field} />
          )),
          expandedItems: (fields || []).map((field, i) => (
            <Filter
              initialSqon={sqon}
              onSubmit={sqon => {
                onSqonUpdate(sqon);
                toggleExpanded();
              }}
              onBack={toggleExpanded}
              onCancel={toggleExpandedDropdown}
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
        <CategoryButton isDropdownVisible={isDropdownVisible}>
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
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Category;
