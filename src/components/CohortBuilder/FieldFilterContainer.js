import React, { useState } from 'react';

import Row from 'uikit/Row';
import { Button } from 'antd';

import './CohortBuilder.css';

const FilterContainer = props => <div class="cb-filterContainer">{props.children}</div>;
const Header = props => <div class="cb-filterContainer-header">{props.children}</div>;
const Footer = props => <Row className="cb-filterContainer-footer">{props.children}</Row>;

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

  const hasSelectedElements = handler => {
    const checkboxes = handler.parentElement.parentElement.parentElement.querySelectorAll(
      'input[type="checkbox"]:checked',
    );
    const toggles = handler.parentElement.parentElement.querySelectorAll(
      'div.toggle-button-option.active',
    );
    let ranges = 0;
    const rangeNodes = handler.parentElement.parentElement.parentElement.querySelectorAll(
      'div.rangeInputContainer input.rangeFilterInput:not([disabled])',
    );
    rangeNodes.forEach((input, key) => {
      const node = rangeNodes.item(key);
      if (node.value.length > 0 && node.value > -1) {
        ranges++;
      }
    });
    return setDisabled(
      checkboxes.length < 1 &&
        toggles.length < 1 &&
        (ranges < rangeNodes.length || rangeNodes.length === 0),
    );
  };
  return (
    <FilterContainer className={className}>
      {showHeader && (
        <Header>
          <Button onClick={onBack} icon="left">
            Back
          </Button>
        </Header>
      )}
      <div
        className="filterContainer"
        onClick={e => {
          const eventTarget = e.target;
          setTimeout(() => {
            hasSelectedElements(eventTarget);
          }, 100);
        }}
        onKeyUp={e => {
          const eventTarget = e.target;
          setTimeout(() => {
            hasSelectedElements(eventTarget);
          }, 100);
        }}
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
