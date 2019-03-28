import * as React from 'react';
import styled from 'react-emotion';

import CheckCircleIcon from 'icons/CheckCircleIcon';

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

  td.checkmark {
    padding: 0px;
    width: 44px;

    div {
      display: flex;
      align-items: center;
    }

    svg {
      flex: 1;
    }
  }

  td.logo {
    padding: 0px;
    width: 136px;

    img {
      max-height: 48px;
      max-width: 136px;
      object-fit: contain;
    }
  }

  td.actions {
    width: 363px;

    background: ${({ theme }) => theme.backgroundGrey};
  }
`;

export default ({ connected = false, logo, description, actions, ...props }) => {
  return (
    <Row>
      <td className="checkmark">
        <div>{connected ? <CheckCircleIcon height={23} /> : null}</div>
      </td>
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
