import React from 'react';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

export default ({ fileId, disabled, hasFilePermission, file, sourceLocation }) => (
  <CavaticaCopyButton
    text="ANALYZE FILE IN CAVATICA"
    style={{
      width: 'auto',
      marginRight: '10px',
    }}
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
    sourceLocation={sourceLocation}
  />
);
