import React from 'react';
import styled from 'react-emotion';
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
  position: absolute;
  left: 0;
  top: 100%;
  cursor: default;
  text-align: left;
  border-radius: 5px;
  box-shadow: 0 0 5.9px 0.1px #bbbbbb;
  border: 1px solid #e0e1e6;
  z-index: 1;
  min-width: 315px;
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

export const FieldFilterContainer = ({
  children,
  onSubmit: onSqonSubmit,
  onCancel,
  onBack,
  applyEnabled = true,
  showHeader = true,
  className = '',
}) => (
  <FilterCont className={className}>
    {showHeader && (
      <Header>
        <WhiteButton onClick={onBack}>
          <LeftIcon />
          Back
        </WhiteButton>
      </Header>
    )}
    <Content className="filterContainer">{children}</Content>
    <Footer>
      <WhiteButton onClick={onCancel}>Cancel</WhiteButton>
      <TealActionButton disabled={!applyEnabled} onClick={onSqonSubmit}>
        Apply
      </TealActionButton>
    </Footer>
  </FilterCont>
);

export const ARRANGER_API_PARTICIPANT_INDEX_NAME = 'participant';
