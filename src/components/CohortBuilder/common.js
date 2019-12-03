import React from 'react';
import { compose, withState } from 'recompose';
import LeftIcon from 'react-icons/lib/fa/angle-left';

import Row from 'uikit/Row';
import { Div } from 'uikit/Core';
import { TealActionButton, WhiteButton } from 'uikit/Button';

import { styleComponent } from 'components/Utils';

import './CohortBuilder.css';

export const ModalContentSection = styleComponent(Div, 'cb-modalContentSection');
const FilterContainer = styleComponent('div', 'cb-filterContainer');
const Header = styleComponent('div', 'cb-filterContainer-header');
const Footer = styleComponent(Row, 'cb-filterContainer-footer');

export const FieldFilterContainer = compose(withState('isDisabled', 'setDisabled', true))(
  ({
    children,
    onSubmit: onSqonSubmit,
    onCancel,
    onBack,
    applyEnabled = true,
    showHeader = true,
    className = '',
    isDisabled,
    setDisabled,
  }) => {
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
            <WhiteButton onClick={onBack}>
              <LeftIcon />
              Back
            </WhiteButton>
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
          <WhiteButton onClick={onCancel}>Cancel</WhiteButton>
          <TealActionButton disabled={!applyEnabled || isDisabled} onClick={onSqonSubmit}>
            Apply
          </TealActionButton>
        </Footer>
      </FilterContainer>
    );
  },
);

export const ARRANGER_API_PARTICIPANT_INDEX_NAME = 'participant';
