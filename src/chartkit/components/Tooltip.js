import React from 'react';
import styled from 'react-emotion';

const TooltipContianer = styled('div')`
  fill: ${({ theme }) => theme.primaryHover};
  font-family: ${({ theme }) => theme.details};
  font-size: 12px;
`;

const Tooltip = ({
  className,
  id,
  value,
  index,
  color,
  data,
  children = null,
  formatter = v => v,
}) => (
  <TooltipContianer className={className} keys={index}>
    {children ? children : formatter(data)}
  </TooltipContianer>
);

export default Tooltip;
