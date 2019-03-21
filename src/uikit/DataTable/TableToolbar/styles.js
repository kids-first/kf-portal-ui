import styled from 'react-emotion';

import { applyDefaultStyles } from '../../Core';
import Row from '../../Row';

export const Toolbar = styled(Row)`
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.greyScale5};
  border-bottom: none;
  padding: 3px 4px;
  align-items: center;
`;

export const PaginationStatus = applyDefaultStyles(styled('div')`
  margin-left: 5px;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.default};
  color: ${({ theme }) => theme.greyScale9};
`);

export const ToolbarGroup = applyDefaultStyles(
  styled(Row)`
    border: 1px solid ${({ theme }) => theme.borderGrey};
    border-radius: 10px;

    > div {
      border-right: 1px solid ${({ theme }) => theme.borderGrey};
    }

    ${({ borderless = false }) => (borderless ? 'border: none;' : '')};

    > div:last-child {
      border: none;
    }
  `,
);

export const ToolbarSelectionCount = styled('div')`
  color: ${({ theme }) => theme.greyScale9};

  min-height: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: none;

  .clearSelection {
    font-family: ${({ theme }) => theme.fonts.details};
    color: ${({ theme }) => theme.primary};
    border: none;
    background: transparent;
    text-decoration: underline;
    cursor: pointer;
  }
  .clearSelection:hover,
  .clearSelection:visited {
    color: ${({ theme }) => theme.hover};
  }
  .clearSelection:active {
    color: ${({ theme }) => theme.highlight};
  }
`;

export const ToolbarDownload = styled('div')`
  position: absolute;
  right: 220px;
  padding-bottom: 4px;
`;
