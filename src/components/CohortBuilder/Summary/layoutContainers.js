import { CardWrapper } from 'uikit/Card/styles';
import Card from 'uikit/Card';
import styled from 'react-emotion';
import { Col } from 'react-grid-system';

export const BarChartContainer = styled('div')`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 20px;
`;

export const CardSlot = styled(Card)`
  height: 305px;
`;

export const LongCard = styled(Card)`
  height: 100%;
`;

export const PaddedColumn = styled(Col)`
  padding: 4px !important;
`;

export const CardSlotPies = styled(CardSlot)`
  height: 305px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 10px;
`;
