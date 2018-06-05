import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import IconWithLoading from 'icons/IconWithLoading';
import DownloadIcon from 'icons/DownloadIcon';
import LoadingOnClick from 'components/LoadingOnClick';

import { GEN3 } from 'common/constants';
import { downloadFileFromGen3 } from 'services/gen3';
import { getFilesById } from 'services/arranger';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const getGen3UUIDs = async kfId => {
  const fileData = await getFilesById({ ids: [kfId], fields: ['latest_did'] });
  return fileData.map(file => file.node.latest_did);
};

const downloadFile = async (kfId, gen3Key) => {
  let files = await getGen3UUIDs(kfId);
  let fileUUID = files && files.length > 0 ? files[0] : null;
  if (!fileUUID) throw new Error('Error retrieving File ID for the selected Row.');
  return downloadFileFromGen3(gen3Key, fileUUID);
};

const DownloadFileButton = compose(injectState, withTheme)(
  ({
    kfId,
    theme,
    effects: { setToast },
    state: { integrationTokens },
    gen3Key = integrationTokens[GEN3],
  }) => (
    <LoadingOnClick
      onClick={() =>
        downloadFile(kfId, gen3Key)
          .then(url => {
            let a = document.createElement('a');
            a.href = url;
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
              action: 'Download File',
              label: url,
            });
            a.download = url.split('/').slice(-1);
            a.click();
          })
          .catch(err => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
              action: 'Download File FAILED',
              label: 'Your account does not have the required permission to download this file.',
            });
            setToast({
              id: `${Date.now()}`,
              action: 'success',
              component: (
                <div
                  css={`
                    display: flex;
                  `}
                >
                  <div
                    css={`
                      display: flex;
                      flex-direction: column;
                    `}
                  >
                    <div
                      css={`
                        font-size: 16px;
                      `}
                    >
                      <Trans>Failed!</Trans>
                    </div>
                    <Trans>Unable to download file</Trans>
                    <div
                      css={`
                        color: 'red';
                        margin-bottom: 20px;
                        padding: 20px;
                      `}
                    >
                      <span>
                        <Trans i18nKey="fileRepoSidebar.missingDownloadPermissions">
                          Your account does not have the required permission to download this file.
                        </Trans>
                      </span>
                    </div>
                  </div>
                </div>
              ),
            });
          })
      }
      render={({ onClick, loading }) => (
        <IconWithLoading
          {...{ loading }}
          spinnerProps={{ color: 'grey' }}
          Icon={() => (
            <DownloadIcon
              {...{ onClick }}
              width={13}
              fill={theme.primary}
              className={css`
                cursor: pointer;
              `}
            />
          )}
        />
      )}
    />
  ),
);

export default DownloadFileButton;
