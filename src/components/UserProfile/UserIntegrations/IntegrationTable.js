import * as React from 'react';

import styled from 'react-emotion';

const UserIntegrationsWrapper = styled('div')`
  table {
    border-collapse: collapse;
  }

  span.integrationHeader {
    font-weight: bold;
  }
  .integrationCell {
  }

  .right {
    text-align: right;
  }
  .connectedButton {
    ${({ theme }) => theme.hollowButton};
  }
`;

const Table = styled('table')`
  tr {
    border: 1px solid ${({ theme }) => theme.greyScale5};
    height: 70px;
    font-size: 13px;
    line-height: 20px;
  }
`;

export default ({ children, ...props }) => {
  return (
    <UserIntegrationsWrapper {...props}>
      <Table style={{ width: '100%' }}>
        <tbody>{children}</tbody>
      </Table>
    </UserIntegrationsWrapper>
  );
};
