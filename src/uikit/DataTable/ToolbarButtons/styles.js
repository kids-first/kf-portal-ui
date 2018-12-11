import styled from 'react-emotion';

export const ToolbarButton = styled('button')`
  display: flex;
  cursor: pointer;
`;

export const DropdownHeader = styled('div')`
  display: inline-block;
  position: relative;
  white-space: nowrap;
`;

export const DropdownContent = styled('div')`
  position: absolute;
  background: white;
  min-width: 100%;
  z-index: 1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  top: 100%;
  left: 'auto';
  right: 0;
`;
