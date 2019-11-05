import React from 'react';
import { Col, Row, Typography } from 'antd';
import './MemberSearchPage.css';
import { withTheme } from 'emotion-theming';

const { Title } = Typography;

const MemberSearchBorder = props => {
  return (
    <div className={'grid-container'}>
      <Row>
        <Title
          level={1}
          style={{
            color: `${props.color ? props.color : props.theme.secondary}`,
            margin: 0,
            padding: 0,
            fontWeight: 500,
            linHeight: 0.71,
            letterSpacing: 0.4,
            fontFamily: `${props.theme.fonts.default}`,
            textDecoration: 'none',
            fontSize: 28,
          }}
        >
          Kids First Membership
        </Title>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>{props.children}</Col>
      </Row>
    </div>
  );
};
const MemberSearchBorderWithTheme = withTheme(MemberSearchBorder);

export default MemberSearchBorderWithTheme;
