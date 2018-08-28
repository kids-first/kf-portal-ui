import * as React from 'react';
import styled from 'react-emotion';
import Pencil from 'react-icons/lib/fa/pencil';
import View from 'react-icons/lib/fa/eye';
import X from 'react-icons/lib/fa/close';

export const UserIntegrationsWrapper = styled('div')`
  table {
    border-collapse: collapse;
  }
  td,
  td {
    background: white;
  }
  font-size: 14px;
  span {
    flex: 1;
  }

  .logoImg {
    width: 150px;
  }

  span.integrationHeader {
    font-weight: bold;
  }
  div.integrationCell {
    display: flex;
    justify-content: center;
  }
  div.integrationCell button {
    text-transform: uppercase;
    flex: 1;
  }
  .right {
    text-align: right;
  }
  .connectedButton {
    ${({ theme }) => theme.hollowButton};
  }
`;

export const IntegrationTable = styled('table')`
  td {
    border: 1px solid ${({ theme }) => theme.greyScale5};
  }
  & thead {
    background: ${({ theme }) => theme.greyScale6};
    color: ${({ theme }) => theme.secondary};
    text-align: left;
  }
`;

export const PencilIcon = props => <Pencil className={'icon'} {...props} />;
export const ViewIcon = props => <View className={'icon'} {...props} />;
export const XIcon = props => <X className={'icon'} {...props} />;
