import styled from 'react-emotion';

export const StyledH3 = styled('h3')`
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0;
`;


export const IntegrationsDiv = styled.div`
  ${({ theme }) => theme.row};
  justify-content: space-around;
  align-items: center;
`;

export const IntegrationsCircleDiv = styled.div`
  width: 82px;
  height: 82px;
  flex: none;
  border-radius: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  border: solid 1px ${({ theme }) => theme.greyScale5};
`;
