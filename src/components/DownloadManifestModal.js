import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import downloadIcon from '../assets/icon-download-white.svg';
import IconWithLoading from '../icons/IconWithLoading';
import CopyToClipboard from './CopyToClipboard';
import { ModalFooter, ModalWarning } from './Modal';
import { FileRepoStats } from './Stats';
import LoadingOnClick from 'components/LoadingOnClick';
import graphql from '../services/arranger';
import Spinner from 'react-spinkit';

const Button = compose(withTheme)(({ theme, children, ...props }) => (
  <button css={theme.actionButton} {...props}>
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {children}
    </div>
  </button>
));

export const SubHeader = ({ children, ...props }) => (
  <div
    className={css`
      margin-bottom: 9px;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.87;
      letter-spacing: 0.2px;
      color: #343434;
    `}
  >
    {children}
  </div>
);

const GenerateManifestSet = compose(injectState, withState('setId', 'setSetId', ''))(
  ({ setId, setSetId, sqon, setWarning, onManifestGenerated, state: { loggedInUser } }) => (
    <div>
      {setId ? (
        <CopyToClipboard value={setId} />
      ) : (
        <LoadingOnClick
          onClick={async () => {
            const { data: { data, errors } } = await graphql({
              query: `
                mutation saveSet($type: String! $userId: String! $sqon: JSON! $path: String!) {
                  saveSet(type: $type, userId: $userId, sqon: $sqon, path: $path) {
                    setId
                  }
                }
              `,
              variables: {
                sqon: sqon || {},
                type: 'file',
                userId: loggedInUser.egoId,
                path: 'kf_id',
              },
            });
            if (errors && errors.length) {
              setWarning('Unable to generate KF-get ID, please try again later.');
            } else {
              setWarning('');
              onManifestGenerated(data.saveSet);
              setSetId(data.saveSet.setId);
            }
          }}
          render={({ onClick, loading }) => (
            <Button {...{ onClick, disabled: loading }}>
              {loading && (
                <Spinner
                  fadeIn="none"
                  name="circle"
                  color="#fff"
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 9,
                  }}
                />
              )}
              <Trans>Generate KF-get ID</Trans>
            </Button>
          )}
        />
      )}
    </div>
  ),
);

export const DownloadManifestModalFooter = ({
  sqon,
  projectId,
  downloadLoading,
  onDownloadClick,
  setWarning,
  onManifestGenerated = () => {},
}) => (
  <ModalFooter showSubmit={false}>
    <GenerateManifestSet {...{ sqon, projectId, setWarning, onManifestGenerated }} />
    <LoadingOnClick
      onClick={onDownloadClick}
      render={({ onClick, loading, finalLoading = loading || downloadLoading }) => (
        <Button {...{ onClick, disabled: finalLoading }}>
          <IconWithLoading {...{ loading: finalLoading, icon: downloadIcon }} />
          <Trans>Download Manifest</Trans>
        </Button>
      )}
    />
  </ModalFooter>
);

const enhance = compose(withState('warning', 'setWarning', ''));
const DownloadManifestModal = ({ sqon, index, projectId, warning, setWarning, children }) => (
  <div>
    {warning && <ModalWarning>{warning}</ModalWarning>}
    <SubHeader>File Summary:</SubHeader>
    <FileRepoStats
      sqon={sqon}
      index={index}
      projectId={projectId}
      css={`
        margin-bottom: 29px;
      `}
    />
    {children({ setWarning })}
  </div>
);

export default enhance(DownloadManifestModal);
