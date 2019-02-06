import styled from 'react-emotion';
import ChevronIcon from 'icons/ChevronIcon';
import DownloadIcon from 'icons/DownloadIcon';

export const ToolbarItem = styled('div')`
  min-height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
`;

export const ToolbarButton = styled('button')`
  color: ${({ theme }) => theme.lightBlue};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.default};
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

export const ColumnIcon = styled(ChevronIcon)`
  color: ${({ theme }) => theme.lightBlue};
  fill: ${({ theme }) => theme.lightBlue};
  margin-left: 6px;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 0)};
`;

export const FileDownloadIcon = styled(DownloadIcon)`
  fill: ${({ theme }) => theme.lightBlue};
  margin-right: 7px;
`;

export const DropdownHeader = styled('div')`
  position: relative;
  white-space: nowrap;
`;

export const DropdownContent = styled('div')`
  position: absolute;
  background: white;
  min-width: 100%;
  z-index: 200;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  top: 100%;
  left: 'auto';
  right: 0;
`;
