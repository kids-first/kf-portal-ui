import styled from 'react-emotion';
// import Row from 'uikit/Row';
import { FileRepoH3 } from '../../uikit/Headings';

// export const ButtonContainer = styled(Row)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 10px 5px;
// `;

export const SaveQueryHeading = styled(FileRepoH3)`
  border-bottom: 1px solid ${({ theme }) => theme.greyScale4};
  padding: 7px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;
