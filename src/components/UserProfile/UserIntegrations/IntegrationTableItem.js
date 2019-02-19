import * as React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

const Row = styled('tr')`
  td {
    padding: 16px;
    font-weight: normal;
    background: white;
    height: 100%;

    div.wrapper {
      height: 100%;

      display: flex;
      justify-content: center;
    }
  }
  td.logo {
    width: 180px;

    img {
      max-height: 38px;
      max-width: 148px;
    }
  }

  td.actions {
    width: 363px;

    background: ${({ theme }) => theme.backgroundGrey};
  }
`;

export default ({ logo, description, actions, ...props }) => {
  return (
    <Row>
      <td className="logo">
        <div className="wrapper">{logo}</div>
      </td>
      <td>
        <div className="wrapper">{description}</div>
      </td>
      <td className="actions">
        <div className="wrapper">{actions}</div>
      </td>
    </Row>
  );
};
