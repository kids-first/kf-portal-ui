import React from 'react';
import { withTheme } from 'emotion-theming';
import { CohortCard } from './ui';
import LoadingSpinner from 'uikit/LoadingSpinner';

const LoaderCard = ({ theme, ...rest }) => (
  <CohortCard {...rest}>
    <LoadingSpinner color={theme.greyScale11} size={'50px'} />
  </CohortCard>
);

export default withTheme(LoaderCard);
