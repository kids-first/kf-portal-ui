import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Row from '../Row';

const StyledCardsContainer = applyDefaultStyles(styled(Row)`
  flex-wrap: wrap;
  width: 100%;

  * >  {
    box-sizing: border-box;
  }
`);

const CardsContainer = ({ children }) => <StyledCardsContainer>{children}</StyledCardsContainer>;

export default CardsContainer;
