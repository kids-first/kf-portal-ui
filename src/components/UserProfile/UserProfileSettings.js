import React, { Fragment } from 'react';
import { Col, Divider, Input, Row, Typography } from 'antd';
import Check from 'react-icons/lib/fa/check';
import { capitalize } from 'lodash';
import { FACEBOOK, GOOGLE, ORCID } from 'common/constants';
import { compose } from "recompose";
import { injectState } from 'freactal';
import { withApi } from 'services/api';

const { Title } = Typography;

const identityProviders = [GOOGLE, FACEBOOK, ORCID];

class UserProfileSettings extends React.Component {

  state={
    loginProvider:''
  };

  render() {
    const { profile } = this.props;
    return (
      <Col
        span={24}
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          borderRadius: 10,
          padding: 15,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          marginBottom: 5,
        }}
      >
        <Title level={2}>{'Settings'}</Title>
        <Divider />
        Email Address:
        <Row>
          <Col span={18}>
            <Input disabled value={profile.email} />
          </Col>
          <Col span={6}>
            {console.log(this.props.profile, 'profile')}
            {console.log(this.state, 'state')}
            {/*{identityProviders.includes(provider) && (*/}
            {/*  <Fragment>*/}
            {/*    <Status>*/}
            {/*      <Check color={theme.active} />*/}
            {/*      {Icon && <Icon />}*/}
            {/*    </Status>*/}
            {/*    <Status>Connected with {capitalize(provider)}</Status>*/}
            {/*  </Fragment>*/}
            {/*)}*/}
          </Col>
        </Row>
      </Col>
    );
  }
}
const UserProfileSettingsEnhanced = compose(injectState, withApi)(UserProfileSettings);

export default UserProfileSettingsEnhanced;