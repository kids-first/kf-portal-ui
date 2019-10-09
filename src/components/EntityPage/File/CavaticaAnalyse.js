import React from 'react';
import { css } from 'react-emotion';

import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

const buttonStyle = props =>
  css`
    width: auto;
    margin-right: 10px;
  `;

export default ({ fileId, disabled, hasFilePermission, file }) => (
  <CavaticaCopyButton
    text="ANALYZE FILE IN CAVATICA"
    buttonStyle={buttonStyle}
    fileIds={[fileId]}
    sqon={{
      op: 'and',
      content: [
        {
          op: 'in',
          content: { field: '_id', value: [fileId] },
        },
      ],
    }}
    disabled={disabled}
    hasFilePermission={hasFilePermission}
    file={file}
  />
);
