import styled from 'react-emotion';

import Card from 'uikit/Card';

export const DashboardCard = styled(Card)`
  width: calc(33% - 60px);
  height: 404px;
  margin: 30px;
  margin-top: 0;

  @media all and (max-width: calc(595px)) {
    width: calc(100vh - 60px);
  }

  @media all and (max-width: calc(1200px)) {
    width: calc(50vh - 60px);
  }
`;
