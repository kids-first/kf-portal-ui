import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { getUser as getGen3User } from 'services/gen3';
import { css } from 'emotion';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import CheckIcon from 'react-icons/lib/fa/check-circle';

import { withApi } from 'services/api';
import { LoadingSpinner } from './UserIntegrations';
import Row from 'uikit/Row';

const styles = css`
  table {
    border-collapse: collapse;
  }
  span.title {
    font-weight: bold;
    padding: 15px;
  }
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('gen3Key', 'setGen3Key', undefined),
  withState('userDetails', 'setUserDetails', {}),
  withState('loading', 'setLoading', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const { setUserDetails, api, setLoading } = this.props;
      setLoading(true);
      let userDetails = await getGen3User(api);
      setLoading(false);
      setUserDetails(userDetails);
    },
  }),
);

const Gen3ConnectionDetails = ({
  state,
  effects,
  theme,
  userDetails,
  setUserDetails,
  loading,
  ...props
}) => (
  <div css={styles}>
    {loading ? (
      <Row justifyContent={'center'}>
        <LoadingSpinner width={20} height={20} />
      </Row>
    ) : (
      <table>
        <tr>
          <div
            css={`
              color: ${theme.active};
              padding: 10px;
            `}
          >
            <CheckIcon size={20} />
            <span> Connected account: {userDetails.name}</span>
          </div>
        </tr>
        <tr>
          <span className="title"> You can download data from these studies:</span>
        </tr>
        <ul>
          {userDetails.projects ? (
            Object.keys(userDetails.projects).map(projectName => (
              <li>
                <span>{projectName}</span>
              </li>
            ))
          ) : (
            <tr />
          )}
        </ul>
      </table>
    )}
  </div>
);

export default enhance(Gen3ConnectionDetails);
