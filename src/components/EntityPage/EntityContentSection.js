import * as React from 'react';

import PropTypes from 'prop-types';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Column from 'uikit/Column';

const Container = styled(Column)`
  padding: 25px 0;
`;

const SectionTitle = applyDefaultStyles(styled('h2')`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: ${({ size }) => (size === 'small' ? '16px' : '20px')};
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.cardTitle};
  margin: 0;
`);

const Content = styled('div')`
  padding-top: 15px;
`;

const EntityContentSection = ({ title, children, size }) => (
  <Container>
    <SectionTitle size={size}>{title}</SectionTitle>
    <Content>{children}</Content>
  </Container>
);

EntityContentSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default EntityContentSection;
