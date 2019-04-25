import React from 'react';
import styled from 'react-emotion';

import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

const Link = styled(ExternalLink)`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.details};
  margin-bottom: 0;
  text-decoration: underline;
`;

const Message = styled('p')`
  font-size: 14px;
  color: #343434;
  font-family: ${({ theme }) => theme.fonts.details};
  margin-bottom: 0;
`;

const Info = ({ link, message = 'Visit our website for more information on' }) => (
  <Column alignItems="center">
    <Message>{message}</Message>
    <Link href={link.url} hasExternalIcon={false}>
      {link.text}
    </Link>
  </Column>
);
export default Info;
