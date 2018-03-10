import React from 'react';
import { StyledH3 } from './styles';

const MySavedQueries = props => (
  <div
    css={`
      display: flex;
      margin-top: 15px;
    `}
  >
    <div
      css={`
        flex: 2;
        padding: 10px 20px;
        border-top: 6px solid #41a7d5;
      `}
    >
      <StyledH3
        css={`
          margin-top: 6px;
          font-weight: 400;
        `}
      >
        My Saved Queries
      </StyledH3>
    </div>
  </div>
);

export default MySavedQueries;
