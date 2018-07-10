import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { isValidKey } from './UserIntegrations';
import { submitGen3Token } from './UserIntegrations/Gen3OauthModal';

import IntegrationStepsModalContent, {
  NumberBullet,
  TokenTitle,
  TokenInput,
  FormErrorMessage,
  DemoImage,
} from 'components/IntegrationStepsModal';
import { ModalFooter, ModalWarning } from 'components/Modal';
import step2Screenshot from 'assets/gen3TokenScreenshot.png';
import { GEN3 } from 'common/constants';
import ExternalLink from 'uikit/ExternalLink';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { gen3WebRoot } from 'common/injectGlobals';
import { getUser as getGen3User } from 'services/gen3';
import { deleteSecret, setSecret } from 'services/secrets';

const enhance = compose(
  injectState,
  withState('gen3Key', 'setGen3Key', undefined),
  withState('invalidToken', 'setInvalidToken', false),
);

const Gen3Connection = ({
  state,
  effects,
  theme,
  gen3Key,
  setGen3Key,
  editingCavitca,
  setEditingGen3,
  invalidValue,
  invalidToken,
  setInvalidToken,
  ...props
}) => {
  return (
    <IntegrationStepsModalContent>
      <div>
        {props.withWarning && (
          <ModalWarning>
            You have not connected to your Gen3 account. Please follow the instructions below to
            connect and start copying files.
          </ModalWarning>
        )}
        <div className="stepRow">
          <div>
            <NumberBullet>1</NumberBullet>
          </div>
          <div className="stepText">
            <span>
              You will need to retrieve your authentication token from the{' '}
              <ExternalLink href={gen3WebRoot} hasExternalIcon={false}>
                Kids First Data Catalog
              </ExternalLink>. After Login, click on the "Profile" tab.
            </span>
          </div>
          <DemoImage src={step2Screenshot} alt="Screenshot of Gen3's Developer Den" />
        </div>
        <div className="stepRow">
          <div>
            <NumberBullet>2</NumberBullet>
          </div>
          <div className="stepText">
            <span>
              Click on "Create API Key", copy and paste it into the field below and click Connect.
            </span>
          </div>
        </div>
        <div css="display:flex; flex-direction:column; margin-left:74px;">
          <TokenTitle>Gen3 Authentication Token:</TokenTitle>
          <TokenInput
            className="tokenInput"
            id="gen3Key"
            value={gen3Key}
            name="gen3"
            placeholder="Gen3 Key"
            onChange={e => {
              setGen3Key(e.target.value);
              setInvalidToken(false);
            }}
          />
          <FormErrorMessage>
            {invalidToken
              ? 'The provided Gen3 Token is invalid. Please update and try again.'
              : ' '}
          </FormErrorMessage>
        </div>
      </div>
      <ModalFooter
        {...{
          handleSubmit: async () => {
            await submitGen3Token({
              token: gen3Key,
              setIntegrationToken: effects.setIntegrationToken,
              onSuccess: props.onComplete,
              onFail: () => setInvalidToken(true),
            });
          },
          submitText: 'Connect',
          submitDisabled: invalidToken || !isValidKey(gen3Key),
        }}
      />
    </IntegrationStepsModalContent>
  );
};

export default enhance(Gen3Connection);
