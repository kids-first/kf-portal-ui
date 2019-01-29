import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';
import { TealActionButton, WhiteButton } from 'uikit/Button';
import LeftIcon from 'react-icons/lib/fa/angle-left';

const FilterCont = styled('div')`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 100%;
  cursor: pointer;
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
`;

const Content = styled('div')`
  flex: 1;
  background-color: white;
`;

const Footer = styled(Row)`
  justify-content: space-between;
  background-color: #e0e1e6;
`;

const WButton = styled(WhiteButton)`
  margin: 5px;
`;

const TealButton = styled(TealActionButton)`
  margin: 5px;
`;

const Filter = ({ children, onCancel, onBack, onApply }) => (
  <FilterCont>
    <Header>
      <WButton onClick={onBack}>
        <LeftIcon />
        Back
      </WButton>
    </Header>
    <Content>{children}</Content>
    <Footer>
      <WButton onClick={onCancel}>Cancel</WButton>
      <TealButton onClick={onApply} mx={5} my={5}>
        Apply
      </TealButton>
    </Footer>
  </FilterCont>
);

export default Filter;
