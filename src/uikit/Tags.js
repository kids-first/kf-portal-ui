import styled, { css } from 'react-emotion';

import { Box } from './Core';

export const Tag = styled(Box)`
  background-color: ${({ theme }) => theme.primaryHover};
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  line-height: 2;
  text-align: left;
  border-radius: 12px;
  padding: 0 12px 0 12px;
  margin: 5px;
  color: ${({ theme }) => theme.white};
  text-transform: capitalize;
  ${({ clickable }) =>
    clickable
      ? css`
          cursor: pointer;
          &::after {
            content: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' stroke='white'><line x1='0' y1='0' x2='8' y2='8' /> <line x1='8' y1='0' x2='0' y2='8' /></svg>");
            margin-left: 9px;
          }
        `
      : ``};
`;
