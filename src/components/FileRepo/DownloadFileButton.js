import React from 'react';
import { notification, Spin } from 'antd';
import { compose } from 'recompose';

import LoadingOnClick from 'components/LoadingOnClick';
import DownloadIcon from 'icons/DownloadIcon';
import { withApi } from 'services/api';
import { getFilesById } from 'services/arranger';
import { downloadFileFromFence } from 'services/fence';
import { getAppElement } from 'services/globalDomNodes';
import theme from 'theme/defaultTheme';

import { FenceName } from '../../store/fenceTypes';

const GEN3 = FenceName.gen3;

const getGen3UUIDs = async (kfId) => {
  const fileData = await getFilesById({ ids: [kfId], fields: ['latest_did'] });
  return fileData.map((file) => file.node.latest_did);
};

//TODO: Needs to be made aware of multiple data repositories, only downloads from Gen3 right now.
const downloadFile = async ({ kfId, api }) => {
  let files = await getGen3UUIDs(kfId);
  let fileUuid = files && files.length > 0 ? files[0] : null;
  if (!fileUuid) throw new Error('Error retrieving File ID for the selected Row.');
  return await downloadFileFromFence({ fileUuid, api, fence: GEN3 });
};

const DownloadFileButton = compose(withApi)(({ kfId, fence, api, render, onSuccess, onError }) => (
  <LoadingOnClick
    onClick={() =>
      downloadFile({ kfId, fence, api })
        .then((url) => {
          const a = document.createElement('a');
          a.href = url;
          if (onSuccess) {
            onSuccess(url);
          }

          a.download = url.split('/').slice(-1);
          a.style.display = 'none';

          // firefox would not trigger download unless the element is present in the dom
          const appRoot = getAppElement();
          appRoot.appendChild(a);
          a.click();
          appRoot.removeChild(a);
        })
        .catch((err) => {
          if (onError) {
            onError(err);
          }
          notification.error({
            message: 'Unable to download file',
            description:
              'Your account does not have the required permission to download this file.',
            duration: 10,
          });
        })
    }
    render={
      render
        ? render
        : ({ onClick, loading }) =>
            loading ? (
              <Spin size={'small'} />
            ) : (
              <DownloadIcon
                {...{ onClick }}
                width={13}
                fill={theme.lightBlue}
                style={{ cursor: 'pointer' }}
              />
            )
    }
  />
));

export default DownloadFileButton;
