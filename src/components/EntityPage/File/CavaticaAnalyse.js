import React from 'react';
import { css } from 'react-emotion';

import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

const buttonStyle = props =>
  css`
    width: auto;
    height: 27px;
    margin-right: 10px;
  `;

const buttonContentStyle = props =>
  css`
    height: 27px;
    font-size: 12px;
    font-weight: 600;
    padding: 9px 13px 9px 6px;
    & img {
      width: 20px;
    }
  `;

export default ({ fileId }) => (
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
  />
);
