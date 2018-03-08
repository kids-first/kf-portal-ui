import * as React from 'react';
import { compose, withState } from 'recompose';

import Button from 'uikit/Button';
import step2Screenshot from 'assets/gen3TokenScreenshot.png';
import { deleteSecret, setSecret, getSecret } from 'services/secrets';
import { GEN3 } from 'common/constants';
import { getUser as getGen3User } from 'services/gen3';
import { ModalFooter } from 'components/Modal/index.js';

import { css } from 'emotion';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import RightArrows from 'react-icons/lib/fa/angle-double-right';
import PencilIcon from 'react-icons/lib/fa/pencil';
import XIcon from 'react-icons/lib/fa/close';
import CheckIcon from 'react-icons/lib/fa/check-circle';

const modalWidth = 1000;
const closeButtonWidth = 30;
const styles = css`

  span.numberBullet{
    color: white;
    background: #00afed;
    width: 14px;
    border-radius: 50%;
    margin: 20px;
    padding: 10px;
    height: 14px;
    display: inline-block;
    text-align: center;
  }

  .tokenTitle {
    padding:20px;
    color: #2b388f;
    font-size: 18px;
    font-weight: bold;
  }
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('gen3Key', 'setGen3Key', ''),
  withState('invalidToken', 'setInvalidToken', false),
);

const getUserDetails = async ({ getIntegrationToken }) => {
  let gen3ApiKey = await getIntegrationToken(GEN3);
  return await getGen3User(JSON.parse(gen3ApiKey));
}
const getConnectionDetails = async ({ userDetails, theme }) => {
  return (<div css="flex-direction: row;">
    <div
      css={`
      color: ${theme.active};
      padding: 10px;
    `}
    >
      <CheckIcon size={20} />
      <span> Connected account: {userDetails.username}</span>
    </div>
    <div>
      <span> You can download data from:</span>
      {Object.keys(userDetails.project_access).map(projectName => <span>projectName</span>)}
    </div>
  </div>
  );
}


const Gen3ConnectionDetails = ({
  state,
  effects,
  theme,
  ...props
}) => {
  console.log(theme);
  await getUserDetails({ getIntegrationToken: effects.getIntegrationToken });
  // .then(userDetails => getConnectionDetails(userDetails, theme))
  // .catch(err => console.error(err));

}

export default enhance(Gen3ConnectionDetails);
