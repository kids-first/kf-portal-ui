import React from 'react';
import { withTheme } from 'emotion-theming';
import { CohortCard } from './ui';
import Spinner from 'react-spinkit';
import Column from 'uikit/Column';
import styled from 'react-emotion';

const Loader = styled(Column)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;

const LoaderCard = ({ theme, ...rest }) => (
  <CohortCard {...rest}>
    <Loader>
      <Spinner
        name="circle"
        color={theme.greyScale11}
        style={{
          width: 50,
          height: 50,
        }}
      />
    </Loader>
  </CohortCard>
);

export default withTheme(LoaderCard);
