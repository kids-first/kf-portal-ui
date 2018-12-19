import React from 'react';
import { ToolbarItem, ToolbarButton, FileDownloadIcon } from './styles';

const Export = ({ exporter = x => x, ...props }) => (
  <ToolbarItem {...props}>
    <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
    <ToolbarButton onClick={x => x}>EXPORT</ToolbarButton>
  </ToolbarItem>
);

export default Export;
