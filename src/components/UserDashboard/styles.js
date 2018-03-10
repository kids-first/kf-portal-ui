import styled from 'react-emotion';

export const StyledH3 = styled('h3')`
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0;
`;

export const SpacedSpan = styled('span')`
  padding-top: 8px;
`;

export const StyledH2 = styled('h2')`
  font-family: Montserrat;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0px;
`;

export const StyledH4 = styled('h4')`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0 0 5px 0;
`;

export const IntegrationsDiv = styled.div`
  ${({ theme }) => theme.row};
  justify-content: space-around;
  align-items: center;
`;

export const IntegrationsCircleDiv = styled.div`
  width: 82px;
  height: 82px;
  border-radius: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  border: solid 1px ${({ theme }) => theme.greyScale5};
`;
