/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Button, Tooltip } from 'antd';

type OwnProps = {
  tooltipText: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  label: string;
  icon: any;
  disabled: boolean;
  className: string;
};

export const VirtualStudiesMenuButton: FunctionComponent<OwnProps> = ({
  tooltipText,
  onClick,
  label,
  icon: Icon,
  disabled = false,
  className = '',
}) => (
  <Tooltip title={<div>{tooltipText}</div>} className={`tooltip ${className}`}>
    <Button icon={Icon} disabled={disabled} onClick={onClick}>
      {label}
    </Button>
  </Tooltip>
);
