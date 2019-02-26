import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Row from 'uikit/Row';

export const CardWrapper = applyDefaultStyles(styled('div')`
  border-radius: 10px;
  box-shadow: 0 0 9.5px 0.5px rgba(160, 160, 163, 0.25);
  background-color: ${({ inactive }) => (inactive ? '#FAFAFC' : '#FFF')};
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  border: solid 1px ${({ theme }) => theme.greyScale5};

  ${props => props.cardWrapperStyle}
`);

export const HeaderWrapper = applyDefaultStyles(styled(Row)`
  opacity: ${props => (props.inactive ? 0.5 : 1)};
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  padding-bottom: 20px;

  ${props => props.headerWrapperStyle}
`);
