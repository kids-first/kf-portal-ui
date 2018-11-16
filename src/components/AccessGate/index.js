import React from 'react';
import styled from 'react-emotion';

import Column from 'uikit/Column';

const Wrapper = styled(Column)`
  background-color: #fff;
  border: solid 1px ${theme => theme.greyScale5};
  border-radius: 20px;
`;

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
  border: 1px solid green;
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

const AccessGate = ({ title, detail, Icon, children }) => (
  <Wrapper alignItems="center">
    <IconWrapper>
      <IconBackground>
        <Icon width={27} height={27} />
      </IconBackground>
    </IconWrapper>
    <h3>{title}</h3>
    <p>{detail}</p>
    {children}
  </Wrapper>
);

export default AccessGate;
