import * as React from 'react';
import { compose } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { CAVATICA } from 'common/constants';
import { cavaticaWebRoot } from 'common/injectGlobals';
import CavaticaProjects from './CavaticaProjects';
import CavaticaConnectButton from './CavaticaConnectButton';
import ExternalLink from 'uikit/ExternalLink';
import DoubleArrowRight from 'icons/DoubleChevronRightIcon';

const enhance = compose(injectState, withTheme);

const CavaticaSidebar = ({ state, theme, ...props }) => {
  return (
    <div>
      {state.integrationTokens[CAVATICA] ? <CavaticaProjects /> : <CavaticaConnectButton />}
      <div css="padding:10px;">
        <ExternalLink href={cavaticaWebRoot}>
          Go to Cavatica{' '}
          <DoubleArrowRight fill={theme.primary} width="10px" css="margin-left:4px;" />
        </ExternalLink>
      </div>
    </div>
  );
};

export default enhance(CavaticaSidebar);
