import React from 'react';
import { Col, Icon, Tabs } from 'antd';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import UserProfilePageAboutMe from 'components/UserProfile/UserProfilePageAboutMe';
import UserProfilePageContacts from 'components/UserProfile/UserProfilePageContacts';
import UserProfilePageResearchInterests from 'components/UserProfile/UserProfilePageResearchInterests';
import UserProfilePageFindMe from 'components/UserProfile/UserProfilePageFindMe';
import UserProfileSettings from 'components/UserProfile/UserProfileSettings';

const TabPane = Tabs.TabPane;

class UserProfilePageContent extends React.Component {
  //TODO change to dumb component

  static propTypes = {
    profile: PropTypes.object,
    // api: PropTypes.
    onSubmitUpdateProfile: PropTypes.func.isRequired,
    canEdit: PropTypes.func.isRequired,
    theme: PropTypes.object,
  };

  render() {
    return (
      <div style={{ paddingRight: 120, paddingLeft: 120 }}>
        <Tabs tabPosition={'left'}>
          <TabPane tab={<span><Icon type="user"/>About Me</span>} key="1">
            <Col span={14} style={{ padding: 5 }}>
              <UserProfilePageAboutMe
                bioTextarea={this.props.profile.bio}
                storyTextarea={this.props.profile.story}
                onSave={this.props.onSubmitUpdateProfile}
                canEdit={this.props.canEdit}
                theme={this.props.theme}
              />
              <UserProfilePageContacts
                onSave={this.onSave}
                canEdit={this.props.canEdit}
                theme={this.props.theme}
                profile={this.props.profile} //FIXME maybe just send the address info
              />
            </Col>
            <Col span={10}>
              <UserProfilePageResearchInterests
                onSave={this.props.onSubmitUpdateProfile}
                canEdit={this.props.canEdit}
                theme={this.props.theme}
                interests={this.props.profile.interests}
              />
              <UserProfilePageFindMe
                onSave={this.props.onSubmitUpdateProfile}
                canEdit={this.props.canEdit}
                theme={this.props.theme}
                profile={this.props.profile}
              />
            </Col>
          </TabPane>
          <TabPane tab={<span><Icon type="setting"/>Settings</span>}  key="2">
            <UserProfileSettings
              profile={this.props.profile}
            />
          </TabPane>
        </Tabs>

      </div>
    );
  }
}

const UserProfilePageContentWithTheme = withTheme(UserProfilePageContent);

export default UserProfilePageContentWithTheme;
