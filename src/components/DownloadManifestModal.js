import React from 'react';
import { compose, withState } from 'recompose';
import styled from 'react-emotion';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';

import IconWithLoading from 'icons/IconWithLoading';
import DownloadIcon from 'icons/DownloadIcon';
import { ModalFooter, ModalWarning } from './Modal';
import LoadingOnClick from 'components/LoadingOnClick';
import Row from 'uikit/Row';
import { TealActionButton } from '../uikit/Button';

// taken out of commission tenporarily
// import GenerateManifestSet from './GenerateManifestSet';

const FooterContentContainer = styled(Row)`
  flex: 1;
  height: 100%;
`;

export const DownloadManifestModalFooter = compose(withTheme)(
  ({
    downloadLoading,
    onDownloadClick,
    // ----- the following props are out of commission temporarily -----
    // theme,
    // sqon,
    // projectId,
    // setWarning,
    // api,
    // setId,
    // setSetId,
    // onManifestGenerated = () => { },
  }) => (
    <ModalFooter showSubmit={false}>
      <FooterContentContainer center>
        {/* // NOTE: feature disabled temporarily, likely to return so we are leaving this here
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
        /> */}
      </FooterContentContainer>
      <LoadingOnClick
        onClick={onDownloadClick}
        render={({ onClick, loading, finalLoading = loading || downloadLoading }) => (
          <TealActionButton
            {...{
              onClick,
              className: `${css`
                height: 100%;
              `}`,
              disabled: finalLoading,
            }}
          >
            <IconWithLoading
              loading={finalLoading}
              Icon={() => (
                <DownloadIcon
                  className={css`
                    margin-right: 9px;
                  `}
                />
              )}
            />
            {'Download Manifest'}
          </TealActionButton>
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
