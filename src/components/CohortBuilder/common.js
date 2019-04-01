import React from 'react';
import styled from 'react-emotion';
import { compose, withState } from 'recompose';
import Row from 'uikit/Row';
import { Div } from 'uikit/Core';

import { TealActionButton, WhiteButton } from 'uikit/Button';
import LeftIcon from 'react-icons/lib/fa/angle-left';

export const ModalContentSection = styled(Div)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const FilterCont = styled('div')`
  color: black;
  display: flex;
  flex-direction: column;
  cursor: default;
  text-align: left;
  border-radius: 5px;
  box-shadow: 0 0 5.9px 0.1px #bbbbbb;
  border: 1px solid #e0e1e6;
  z-index: 1;
  min-width: 315px;

  input[type='number'] {
    padding: 0 7px;
  }
`;

const Header = styled('div')`
  background-color: white;
  border-bottom: 1px solid #d4d6dd;
  padding: 5px;
`;

const Content = styled('div')`
  flex: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  &.filterContainer {
    border: none;
    box-shadow: none;
    margin: 0px;
    width: 100%;
    border-radius: 0px;
  }
`;

const Footer = styled(Row)`
  justify-content: space-between;
  background-color: #e0e1e6;
  padding: 5px;
`;

export const FieldFilterContainer = compose(
  withState('isDisabled', 'setDisabled', true),
)(({
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
  const hasSelectedElements = (handler) => {
      const checkboxes = handler.parentElement.parentElement.querySelectorAll('input[type="checkbox"]:checked');
      const toggles = handler.parentElement.parentElement.querySelectorAll('div.toggle-button-option.active');
      setDisabled( (checkboxes.length < 1 && toggles.length < 1) )
  }
  return (
  <FilterCont className={className}>
    {showHeader && (
      <Header>
        <WhiteButton onClick={onBack}>
          <LeftIcon />
          Back
        </WhiteButton>
      </Header>
    )}
    <Content className="filterContainer"
      onClick={(e) => {
        const eventTarget = e.target;
        setTimeout(() => {
          hasSelectedElements(eventTarget)
        }, 100)
      }}
    >{children}</Content>
    <Footer>
      <WhiteButton onClick={onCancel}>Cancel</WhiteButton>
      <TealActionButton disabled={!applyEnabled || isDisabled} onClick={onSqonSubmit}>
        Apply
      </TealActionButton>
    </Footer>
  </FilterCont>
)});

export const ARRANGER_API_PARTICIPANT_INDEX_NAME = 'participant';
