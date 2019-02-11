import React from 'react';
import { css } from 'react-emotion';

import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

const buttonStyle = props =>
  css`
    width: auto;
    margin-right: 10px;
  `;

export default ({ fileId, disabled }) => (
  <CavaticaCopyButton
    text="ANALYZE FILE IN CAVATICA"
    buttonStyle={buttonStyle}
    selectedTableRows={[fileId]}
    sqon={{
      op: 'and',
      content: [
        {
          op: 'in',
          content: { field: 'kf_id', value: [fileId] },
        },
      ],
    }}
    disabled={disabled}
  />
);
