import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Column from 'uikit/Column';

const Wrapper = applyDefaultStyles(styled(Column)`
  background-color: #fff;
  border: solid 1px #e0e1e6;
  border-radius: 20px;
  width: 100%;
  margin-bottom: 10px;
  text-align: center;
`);

const IconWrapper = styled('div')`
  position: relative;
  top: -25px;
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
  </Column>
);

export default AccessGate;
