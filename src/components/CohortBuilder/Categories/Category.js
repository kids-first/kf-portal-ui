import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import Dropdown from 'uikit/Dropdown';
import { compose } from 'recompose';
import { withDropdownMultiPane } from 'uikit/Dropdown';
import Filter from './Filter';
import CategoryRow from './CategoryRow';

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

const Options = styled('div')`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
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
  padding: 17px 10px 17px 23px;
  font-size: 12px;
  color: #343434;
  font-weight: 500;
`;

const Title = styled('h3')`
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.default}, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.filterPurple};
`;

const CategoryButton = styled(Column)`
  align-items: center;
`;

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
    sqon,
    onSqonUpdate,
  }) => (
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
        items: (fields || []).map((item, i) => <CategoryRow active={true} title={item} />),
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
            arrangerProjectId={'nov_30_1'}
            arrangerProjectIndex={'participant'}
          />
        )),
        ContainerComponent: ({ children, ...props }) => (
          <Container {...props} color={color}>
            {children}
          </Container>
        ),
        OptionsContainerComponent: Options,
        ItemWrapperComponent: ItemWrapper,
      }}
    >
      <CategoryButton>
        {children}
        <Title> {title}</Title>
      </CategoryButton>
    </Dropdown>
  ),
);

Category.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Category;
