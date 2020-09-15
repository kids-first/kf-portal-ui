import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'uikit/Row';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { container, containerContent, footer, header } from './FieldFilterContainer.module.css';

const FilterContainer = (props) => (
  <div className={`${container} ${props.className}`}>{props.children}</div>
);

FilterContainer.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

const Header = (props) => <div className={header}>{props.children}</div>;

Header.propTypes = {
  children: PropTypes.element.isRequired,
};

const Footer = (props) => <Row className={footer}>{props.children}</Row>;

Footer.propTypes = {
  children: PropTypes.element.isRequired,
};

const findAllCheckedBoxes = (el) => el?.querySelectorAll('input[type="checkbox"]:checked');
const findAllActiveToggles = (el) => el?.querySelectorAll('div.toggle-button-option.active');
const findAllRanges = (el) =>
  el?.querySelectorAll('div.rangeInputContainer input.rangeFilterInput:not([disabled])');

export const FieldFilterContainer = ({
  children,
  onSubmit: onSqonSubmit,
  onCancel,
  onBack,
  applyEnabled = true,
  showHeader = true,
  className = '',
}) => {
  const [isDisabled, setDisabled] = useState(true);

  const hasSelectedElements = () => {
    const termsWrapperElement = document.getElementById('terms-wrapper');

    const checkboxes = findAllCheckedBoxes(termsWrapperElement) || [];
    const toggles = findAllActiveToggles(termsWrapperElement) || [];
    const rangeNodes = findAllRanges(termsWrapperElement) || [];

    let ranges = 0;
    rangeNodes.forEach((input, key) => {
      const node = rangeNodes.item(key);
      if (node.value.length > 0 && node.value > -1) {
        ranges++;
      }
    });

    const hasNoCheckedBox = checkboxes.length < 1;
    const hasNoActiveToggle = toggles.length < 1;
    const hasEmptyOrIncompleteRange = ranges < rangeNodes.length || rangeNodes.length === 0;

    return setDisabled(hasNoCheckedBox && hasNoActiveToggle && hasEmptyOrIncompleteRange);
  };

  const wrapperHandler = () => {
    setTimeout(() => {
      hasSelectedElements();
    }, 50);
  };

  return (
    <FilterContainer className={className}>
      {showHeader && (
        <Header>
          <Button onClick={onBack} icon={<LeftOutlined />}>
            Back
          </Button>
        </Header>
      )}
      <div
        id={'terms-wrapper'}
        className={`${containerContent} filterContainer`}
        onClick={wrapperHandler}
        onKeyUp={wrapperHandler}
      >
        {children}
      </div>
      <Footer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button disabled={!applyEnabled || isDisabled} onClick={onSqonSubmit}>
          Apply
        </Button>
      </Footer>
    </FilterContainer>
  );
};

FieldFilterContainer.propTypes = {
  children: PropTypes.element.isRequired,
  onCancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
  applyEnabled: PropTypes.bool,
  showHeader: PropTypes.bool,
};
