import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import saveSet from '@arranger/components/dist/utils/saveSet';

import downloadIcon from '../assets/icon-download-white.svg';
import IconWithLoading from '../icons/IconWithLoading';
import { copyValueToClipboard } from './CopyToClipboard';
import { ModalFooter, ModalWarning } from './Modal';
import LoadingOnClick from 'components/LoadingOnClick';
import graphql from '../services/arranger';
import Spinner from 'react-spinkit';

const Button = compose(withTheme)(({ theme, children, className, ...props }) => (
  <button className={`${theme.actionButton} ${className}`} {...props}>
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

const ManifestGeneratorStyle = () =>
  `manifestSetGenerator ${css`
    &.manifestSetGenerator {
      height: 100%;
      background: white;
      border-radius: 1000px;
      display: flex;
      & .copyContent {
        padding-left: 20px;
        padding-right: 20px;
        flex: 1;
        justify-content: center;
        align-items: center;
        display: flex;
      }
      & .generateButton {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
  `}`;

const GenerateManifestSet = compose(injectState, withTheme)(
  ({
    api,
    theme,
    setId,
    setSetId,
    sqon,
    setWarning,
    onManifestGenerated,
    state: { loggedInUser },
    effects: { addUserSet },
    className,
  }) => {
    const copyRef = React.createRef();
    return (
      <div className={`${ManifestGeneratorStyle()}`}>
        <LoadingOnClick
          onClick={async () => {
            if (setId) {
              copyValueToClipboard({ value: setId, copyRef });
            } else {
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
                const { setId: receivedSetId, size } = data.saveSet;
                setWarning('');
                setSetId(receivedSetId);
                onManifestGenerated(data.saveSet);
                addUserSet({ type, setId: receivedSetId, size, api });
              }
            }
          }}
          render={({ onClick, loading }) => (
            <Fragment>
              <span ref={copyRef} className={`copyContent`}>
                {setId || <Trans>Generate KF-get ID</Trans>}
              </span>
              <Button
                {...{ onClick, disabled: loading, className: `generateButton ${theme.uppercase}` }}
              >
                {' '}
                {loading ? (
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
                ) : setId ? (
                  <Trans>Copy</Trans>
                ) : (
                  <Trans>GENERATE</Trans>
                )}
              </Button>
            </Fragment>
          )}
        />
      </div>
    );
  },
);

export const DownloadManifestModalFooter = compose(withTheme)(
  ({
    theme,
    sqon,
    projectId,
    downloadLoading,
    onDownloadClick,
    setWarning,
    api,
    setId,
    setSetId,
    onManifestGenerated = () => {},
  }) => (
    <ModalFooter showSubmit={false}>
      <GenerateManifestSet
        {...{
          sqon,
          projectId,
          setWarning,
          onManifestGenerated,
          api,
          setId,
          setSetId,
        }}
      />
      <LoadingOnClick
        onClick={onDownloadClick}
        render={({ onClick, loading, finalLoading = loading || downloadLoading }) => (
          <Button
            {...{
              onClick,
              className: `${theme.uppercase} ${css`
                height: 100%;
              `}`,
              disabled: finalLoading,
            }}
          >
            <IconWithLoading {...{ loading: finalLoading, icon: downloadIcon }} />
            <Trans>Download Manifest</Trans>
          </Button>
        )}
      />
    </ModalFooter>
  ),
);

export default compose(withState('warning', 'setWarning', ''))(
  ({ sqon, index, projectId, warning, setWarning, children, api }) => (
    <div>
      {warning && <ModalWarning>{warning}</ModalWarning>}
      {children({ setWarning })}
    </div>
  ),
);
