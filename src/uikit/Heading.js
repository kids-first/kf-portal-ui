import styled from 'react-emotion';

const Heading = styled('div')`
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 15px;
  font-weight: 500;
`;

export default Heading;
