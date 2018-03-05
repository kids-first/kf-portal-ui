import * as React from 'react';
import { compose, withState } from 'recompose';

import Button from 'uikit/Button';
import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { deleteSecret, setSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';

import { css } from 'emotion';
import { injectState } from 'freactal';
import XIcon from 'react-icons/lib/fa/close';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

const modalWidth = 1000;
const closeButtonWidth = 30;
const styles = css`
  .modalOverlay {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modalBody {
    width: ${modalWidth}px;
    height: 800px;
    position: relative;
    background: white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 4px;
  }

  .modalHeader {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  
  .modalTitle {
    padding:20px;
    border-bottom: solid 1px #d4d6dd;
    flex:1;
    font-family: Montserrat;
    text-align: left;
    color: #2b388f;
    font-size: 18px;
  }

  .modalFooter {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    background: #EDEEF2;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .modalClose {
    padding:10px;
    border-bottom: solid 1px #d4d6dd;
    flex:1;
    text-align: right;
    margin-top:-6px;
    margin-top:-6px;
    font-size: 24px;
  }
  .clickable:hover {
    cursor:pointer;
  }

  .modalCancel {
    color: #009bb8;
  }

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

  .tokenInput {
    margin: 20px;
    padding: 3px;
    font-size: 16px;
    border-radius: 10px;
  }
`;

const enhance = compose(
  injectState,
  withState('cavaticaKey', 'setCavaticaKey', ''),
  withState('invalidToken', 'setInvalidToken', false),
);

const submitCavaticaToken = async ({ token, setIntegrationToken, onSuccess, onFail }) => {

  await setSecret({ service: CAVATICA, secret: token });
  await getCavaticaUser(token)
    .then(userData => {
      setIntegrationToken(CAVATICA, userData);
      onSuccess();
    })
    .catch(response => {
      setIntegrationToken(CAVATICA, null);
      deleteSecret({ service: CAVATICA });
      onFail();
    });
}


const CavaticaTokenInput = ({
  state,
  effects,
  theme,
  cavaticaKey,
  setCavaticaKey,
  gen3Key,
  setGen3Key,
  editingCavitca,
  setEditingCavatica,
  invalidValue,
  setInvalidToken,
  ...props
}) => {
  return (
    <div css={styles}>
      <div className="modalOverlay">
        <div className="modalBody">
          <div className="modalHeader">
            <span className="modalTitle" >How to Connect to Cavatica</span>
            <span className="modalClose"><XIcon className="clickable" onClick={props.onCancel} /></span>
          </div>
          <div className="modalBody">
            <div>
              <span className="numberBullet">1</span>
              <span>If you don't have one, please <a href="https://pgc-accounts.sbgenomics.com/auth/register/" rel="noopener noreferrer" target="_blank">register for a Cavatica Account <RightArrows /></a> </span>
            </div>
            <div css={css`display:flex;`}>
              <div css={css`flex:1`}>
                <span className="numberBullet">2</span>
                <span>You will need to retrieve your authentication token from the Cavatica <a href="https://cavatica.sbgenomics.com/developer#token" rel="noopener noreferrer" target="_blank">Developer Dashboard</a>. From the Dashboard, click on the "Auth Token" tab.</span>
              </div>
              <div css={css`flex:1`}>
                <img
                  css={css`width:400px;`}
                  src={step2Screenshot}
                  alt="Screenshot of Cavatica's Developer Den" />
              </div>
            </div>
            <div>
              <span className="numberBullet">3</span>
              <span>Click on "Generate Token", copy and paste it into the field below and click Connect.</span>
            </div>
            <div>
              <span className="tokenTitle">Cavatica Authentication Token:</span>
              <input
                className="tokenInput"
                id="cavaticaKey"
                type="text"
                value={cavaticaKey}
                name="cavatica"
                placeholder="Cavatica Key"

                onChange={e => setCavaticaKey(e.target.value)}
              />
            </div>
          </div>
          <div className="modalFooter">
            <div >
              <span className="modalCancel clickable" onClick={props.onCancel}>Cancel</span>
            </div>
            <div css={css`text-align: right;`}>
              <span ><Button id="cavaticaSubmitToken" onClick={() => {
                submitCavaticaToken({
                  token: cavaticaKey,
                  setIntegrationToken: effects.setIntegrationToken,
                  onSuccess: props.onComplete,
                  onFail: () => setInvalidToken(true)
                });
              }} >
                Connect
              </Button></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default enhance(CavaticaTokenInput);
