import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Row from '../Row';

const StyledCardsContainer = applyDefaultStyles(styled(Row)`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;

  @media all and (max-width: calc(1200px)) {
    align-items: center;
    justify-content: center;
  }
  @media all and (max-width: calc(595px)) {
    align-items: center;
    justify-content: center;
  }
`);

const CardsContainer = ({ children }) => <StyledCardsContainer>{children}</StyledCardsContainer>;

export default CardsContainer;
