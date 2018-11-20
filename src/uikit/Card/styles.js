import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';

export const CardWrapper = applyDefaultStyles(styled('div')`
  border-radius: 10px;
  box-shadow: 0 0 9.5px 0.5px rgba(160, 160, 163, 0.25);
  background-color: rgba(255, 255, 255, ${({ inactive }) => (inactive ? '50%' : '100%')});
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  border: solid 1px ${({ theme }) => theme.greyScale5};
`);
