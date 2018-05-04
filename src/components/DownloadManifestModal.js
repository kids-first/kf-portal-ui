import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import saveSet from '@arranger/components/dist/utils/saveSet';

import downloadIcon from '../assets/icon-download-white.svg';
import IconWithLoading from '../icons/IconWithLoading';
import CopyToClipboard from './CopyToClipboard';
import { ModalSubHeader, ModalFooter, ModalWarning } from './Modal';
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

const GenerateManifestSet = compose(injectState, withState('setId', 'setSetId', ''))(
  ({
    api,
    setId,
    setSetId,
    sqon,
    setWarning,
    onManifestGenerated,
    state: { loggedInUser },
    effects: { addUserSet },
  }) => (
    <div>
      {setId ? (
        <CopyToClipboard value={setId} />
      ) : (
        <LoadingOnClick
          onClick={async () => {
            const type = 'file';
            const { data, errors } = await saveSet({
              type,
              sqon: sqon || {},
              userId: loggedInUser.egoId,
              path: 'kf_id',
              api: graphql(api),
            });
            if (errors && errors.length) {
              setWarning('Unable to generate KF-get ID, please try again later.');
            } else {
              const { setId, size } = data.saveSet;
              setWarning('');
              setSetId(setId);
              onManifestGenerated(data.saveSet);
              addUserSet({ type, setId, size, api });
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
  api,
  onManifestGenerated = () => {},
}) => (
  <ModalFooter showSubmit={false}>
    <GenerateManifestSet {...{ sqon, projectId, setWarning, onManifestGenerated, api }} />
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
const DownloadManifestModal = ({ sqon, index, projectId, warning, setWarning, children, api }) => (
  <div>
    {warning && <ModalWarning>{warning}</ModalWarning>}
    <ModalSubHeader>File Summary:</ModalSubHeader>
    <FileRepoStats
      api={api}
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
