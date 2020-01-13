import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import Input from 'uikit/Input';

export const NumberBullet = styled.span`
  color: white;
  background: green;
  width: 14px;
  border-radius: 50%;
  margin: 20px;
  padding: 10px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TokenTitle = styled.span`
  color: ${props => props.theme.secondary};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TokenInput = styled(Input)`
  width: 35em;
  max-width: 90%;
`;

export const FormErrorMessage = styled.div`
  color: #e45562;
  padding: 10px;
  padding-left: 20px;
  height: 1.6em;
`;

export const DemoImage = withTheme(styled.img`
  height: 210px;
  border: solid 2px ${({ theme }) => theme.borderGrey};
`);

export default styled.div`
  div.stepText {
    line-height: 1.6em;
  }

  .stepRow {
    display: flex;
    flex-direction: row;
  }

  .stepText {
    padding-top: 20px;
  }
`;
