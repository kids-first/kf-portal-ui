import React from 'react';
import { css } from 'react-emotion';

import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

const buttonStyle = props =>
  css`
    width: auto;
    margin-right: 10px;
  `;

const buttonContentStyle = props =>
  css`
    padding: 0 5px;
    & img {
      width: 20px;
    }
  `;

export default ({ fileId, disabled }) => (
  <CavaticaCopyButton
    text="ANALYZE FILE IN CAVATICA"
    buttonStyle={buttonStyle}
    buttonContentStyle={buttonContentStyle}
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
