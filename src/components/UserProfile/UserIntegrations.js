import * as React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';

import Button from 'uikit/Button';
import RightIcon from 'react-icons/lib/fa/angle-right';
import PencilIcon from 'react-icons/lib/fa/pencil';
import XIcon from 'react-icons/lib/fa/close';
import CheckIcon from 'react-icons/lib/fa/check-circle';

import { setSecret, getSecret, deleteSecret } from 'services/secrets';
import CavaticaInput from 'components/UserProfile/CavaticaTokenInput';
import gen3Logo from 'assets/logo-gen3.png';
import cavaticaLogo from 'assets/logo-cavatica.png';
import { CAVATICA, GEN3 } from 'common/constants';
import { getUser } from 'services/cavatica';

const styles = css`
    td {
      background: white;
    }
    font-size: 14px;
    span {
      flex: 1;
    }
    button {
      flex: 1;
      font-weight:bold;
      padding: 6px;
      margin: 2px;
      padding-left: 5px;
      text-transform: uppercase;
    }

    span.integrationHeader {
      font-weight: bold;
    }
    div.integrationCell {
      display: flex;
      width: 100%;
    }
    div.integrationCell button {
      text-transform: uppercase;
      flex: 1;
    }
    .right {
      text-align: right;
    }
    .connectedButton {
      color:black;
      background:none;
    }
  `;

const enhance = compose(
  injectState,
  withTheme,
  withState('editingCavatica', 'setEditingCavatica', false),
);

const gen3Status = ({ gen3Key }) => {
  return (
    <div>
      <span>Connected: {gen3Key} </span>
    </div>
  )
};

const cavaticaStatus = ({ theme, cavaticaKey, onEdit, onRemove }) => {
  return (
    <div css={css`flex-direction:column;`}>
      <div css={css`
        color:${theme.active};
        padding: 10px;
      `}>
        <CheckIcon size={20} /><span> Connected</span>
      </div>
      <div css={css`
        display:flex;
      `}>
        <Button
          onClick={onEdit}
          className="connectedButton"
        ><PencilIcon />Edit</Button>
        <Button
          onClick={onRemove}
          className="connectedButton"
        ><XIcon />Remove</Button>
      </div>
    </div >
  )
};

const testMethod = () => {
  console.log(getUser());
}

const UserIntegrations = ({
  state: { integrationTokens },
  effects,
  theme,
  editingCavatica,
  setEditingCavatica,
  ...props
}) => {
  return (
    <div css={styles}>
      <table css={css`
        border-collapse: collapse;
        
        td, th {
          border: 1px solid ${theme.greyScale5};
          padding: 12px;
          font-weight: normal;
        }
      `}>
        <thead css={css`
          background: ${theme.greyScale6};
          color: ${theme.secondary};
          text-align: left;
        `}>
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>Integrate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img src={gen3Logo} alt="Gen3 Logo" /></td>
            <td>
              <span className="integrationHeader" >Download Controlled Data</span>
              <p>Access and download controlled data by connecting your Kdis First account to <a href="https://gen3.kids-first.io/" rel="noopener noreferrer" target="_blank" >Gen3</a>.</p>
            </td>
            <td>
              <div className="integrationCell" >
                {
                  integrationTokens[GEN3]
                    ? gen3Status(integrationTokens[GEN3])
                    : <Button onClick={() => testMethod()}><span>Connect</span><RightIcon className="right" /></Button>
                }
              </div>
            </td>
          </tr>
          <tr>
            <td><img src={cavaticaLogo} alt="Cavatica Logo" /></td>
            <td>
              <span className="integrationHeader" >Analyze Data</span>
              <p>Analyze data quickly by connecting your Kids First account to <a href="http://cavatica.org/" rel="noopener noreferrer" target="_blank" >Cavatica</a>.</p>
            </td>
            <td>
              <div className="integrationCell" >
                {
                  integrationTokens[CAVATICA]
                    ? cavaticaStatus({
                      theme,
                      cavaticaKey: integrationTokens[CAVATICA],
                      onEdit: () => setEditingCavatica(true),
                      onRemove: () => { deleteSecret({ service: CAVATICA }); effects.setIntegrationToken(CAVATICA, null); }
                    })
                    : <Button onClick={() => setEditingCavatica(true)}><span>Connect<RightIcon /> </span></Button>
                }
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {
        editingCavatica &&
        <CavaticaInput
          onComplete={() => setEditingCavatica(false)}
          onCancel={() => setEditingCavatica(false)}
        />

      }
    </div>
  );
};

export default enhance(UserIntegrations);
