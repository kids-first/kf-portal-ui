import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

const Wrapper = applyDefaultStyles(styled(Column)`
  background-color: #fff;
  border: solid 1px #e0e1e6;
  border-radius: 20px;
  width: 100%;
  margin-bottom: 10px;
`);

const IconWrapper = styled('div')`
  position: relative;
  top: -25px;
  z-index: 1;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e1e6;
  background-color: #fff;
`;

const IconBackground = styled('div')`
  background-color: #aaaec1;
  border-radius: 50%;
  padding: 2px;
  width: 45px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Heading = styled('div')`
  font-size: 16px;
  color: #2b388f;
  margin-bottom: 5px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.default};
`;

const Message = styled('p')`
  font-size: 14px;
  color: #343434;
  font-family: ${({ theme }) => theme.fonts.details};
  margin-bottom: 0;
`;

const ActionSection = styled('div')`
  margin: 20px 0;
`;

const InfoLink = styled(ExternalLink)`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.details};
  margin-bottom: 0;
  text-decoration: underline;
`;

const AccessGate = ({
  title,
  detail,
  Icon,
  infoLink = { text: 'functionality', url: '' },
  children,
  mt,
}) => (
  <Column alignItems="center">
    <Wrapper alignItems="center" mt={mt}>
      <IconWrapper>
        <IconBackground>
          <Icon width={23} height={23} />
        </IconBackground>
      </IconWrapper>
      <Heading>{title}</Heading>
      <Message>{detail}</Message>
      <ActionSection>{children}</ActionSection>
    </Wrapper>
    <Message>Visit our website for more information on</Message>
    <InfoLink href={infoLink.url} hasExternalIcon={false}>
      {infoLink.text}
    </InfoLink>
  </Column>
);

export default AccessGate;
