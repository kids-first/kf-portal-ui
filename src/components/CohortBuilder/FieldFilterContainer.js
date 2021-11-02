import React, { useEffect, useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import Row from 'uikit/Row';

import { container, containerContent, footer, header } from './FieldFilterContainer.module.css';

const FilterContainer = (props) => (
  <div className={`${container} ${props.className}`}>{props.children}</div>
);

FilterContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  className: PropTypes.string,
};

const Header = (props) => <div className={header}>{props.children}</div>;

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
};

const Footer = (props) => <Row className={footer}>{props.children}</Row>;

Footer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
};

const findAllCheckedBoxes = (el) => el?.querySelectorAll('input[type="checkbox"]:checked');
const findAllActiveToggles = (el) => el?.querySelectorAll('div.toggle-button-option.active');
const findAllRanges = (el) =>
  el?.querySelectorAll('div.rangeInputContainer input.rangeFilterInput:not([disabled])');
const getFilterWrapperId = (id) => (id ? `terms-wrapper-${id}` : 'terms-wrapper');

export const FieldFilterContainer = ({
  children,
  onSubmit: onSqonSubmit,
  onCancel,
  onBack,
  applyEnabled = true,
  showHeader = true,
  className = '',
  id = '',
}) => {
  const [isDisabled, setDisabled] = useState(true);

  const hasSelectedElements = () => {
    const termsWrapperElement = document.getElementById(getFilterWrapperId(id));

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

  useEffect(() => {
    hasSelectedElements();
  }, []);

  const wrapperHandler = () => {
    setTimeout(() => {
      hasSelectedElements();
    }, 50);
  };

  return (
    <FilterContainer className={className}>
      {showHeader && onBack && (
        <Header>
          <Button onClick={onBack} icon={<LeftOutlined />}>
            Back
          </Button>
        </Header>
      )}
      <div
        id={getFilterWrapperId(id)}
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
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  onCancel: PropTypes.func.isRequired,
  id: PropTypes.string,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  applyEnabled: PropTypes.bool,
  showHeader: PropTypes.bool,
};
