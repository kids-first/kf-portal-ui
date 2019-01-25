import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';

const Link = styled(Row)`
  padding-bottom: 5px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  color: #cc3399;
  border-bottom: ${({ active }) => (active ? '2px solid #cc3399' : null)};
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

const ViewLink = ({ children, icon, onClick, active }) => (
  <Link active={active} onClick={onClick}>
    {children}
  </Link>
);

export default ViewLink;
