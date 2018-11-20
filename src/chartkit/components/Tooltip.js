import React from 'react';
import styled from 'react-emotion';

const TooltipContianer = styled('div')`
  fill: ${({ theme }) => theme.primaryHover};
  font-family: ${({ theme }) => theme.details};
  font-size: 12px;
`;

const Tooltip = ({ id, value, index, color, data, formatter = () => null }) => (
  <TooltipContianer keys={index}>{formatter(data)}</TooltipContianer>
);

export default Tooltip;
