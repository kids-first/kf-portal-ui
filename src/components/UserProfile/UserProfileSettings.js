import React, { Fragment } from 'react';
import { Card, Col, Divider, Input, Row, Typography } from 'antd';
import { FACEBOOK, GOOGLE, ORCID } from 'common/constants';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withApi } from 'services/api';
import { isFeatureEnabled } from 'common/featuresToggles';
import IntegrationTable from 'components/UserProfile/UserIntegrations/IntegrationTable';
import IntegrationTableItem from 'components/UserProfile/UserIntegrations/IntegrationTableItem';
import PublicIcon from 'react-icons/lib/fa/unlock';
import PrivacyIcon from 'react-icons/lib/fa/lock';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Meta } = Card;

const identityProviders = [GOOGLE, FACEBOOK, ORCID];

class UserProfileSettings extends React.Component {
  state = {
    loginProvider: '',
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
        <Card title={<Title level={2}>{'Settings'}</Title>} bordered={false}>
          <Row>
            <Col span={18}>
              <Input disabled value={profile.email} />
            </Col>
            <Col span={6}>
              {console.log(this.props.profile, 'profile')}
              {console.log(this.state, 'state')}
              {identityProviders.includes(profile.loginProvider) && (
                <Fragment>
                  {/*<Status>*/}
                  {/*  <Check color={theme.active} />*/}
                  {/*  {Icon && <Icon />}*/}
                  {/*</Status>*/}
                  {/*<Status>Connected with {capitalize(provider)}</Status>*/}
                </Fragment>
              )}
            </Col>
          </Row>
        </Card>

        {isFeatureEnabled('searchMembers') && (
          <Card title={<Title level={2}>{'Privacy'}</Title>} bordered={false}>
            <Meta
              description="When your profile is public, other logged-in Kids First members (and potential
          contributors) will be able to find your profile in searches. If your profile is private,
          you will be private and unsearchable to others."
            />
            <Row>
                {identityProviders.includes(profile.loginProvider) && (
                  <IntegrationTable>
                    <IntegrationTableItem
                      connected={false}
                      //https://www.materialpalette.com/icons
                      logo={profile.isPublic ? <PublicIcon size={30} /> : <PrivacyIcon size={30} />}
                      description={
                        <span style={{ width: '100%' }}>
                          You profile is currently{' '}
                          <b>{`${profile.isPublic ? 'public' : 'private'}`}</b>.
                          {profile.isPublic ? (
                            <span>
                              {' '}
                              Click <Link to={'/user/' + profile._id}>here</Link> to view your
                              public profile.
                            </span>
                          ) : (
                            ''
                          )}
                        </span>
                      }
                      // actions={
                      //   <PrivacyToggle
                      //     checked={profile.isPublic}
                      //     onClick={checked => {
                      //       profile.isPublic = checked;
                      //       submit(profile);
                      //     }}
                      //   />
                      // }
                    />
                  </IntegrationTable>
                )}
            </Row>
          </Card>
        )}
      </Col>
    );
  }
}
const UserProfileSettingsEnhanced = compose(
  injectState,
  withApi,
)(UserProfileSettings);

export default UserProfileSettingsEnhanced;
