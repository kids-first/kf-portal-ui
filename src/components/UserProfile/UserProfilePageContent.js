import React from 'react';
import { Col } from 'antd';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import UserProfilePageAboutMe from 'components/UserProfile/UserProfilePageAboutMe';
import UserProfilePageContacts from 'components/UserProfile/UserProfilePageContacts';
import UserProfilePageResearchInterests from 'components/UserProfile/UserProfilePageResearchInterests';

class UserProfilePageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  static propTypes = {
    profile: PropTypes.object,
    loggedInUser: PropTypes.object,
    // api: PropTypes.
    onSubmitUpdateProfile: PropTypes.func.isRequired,
    canEdit: PropTypes.func.isRequired,
    theme: PropTypes.object,
  };

  render() {
    const { bioTextarea, storyTextarea } = this.state;
    return (
      <div>
        <Col span={14} style={{ padding:5 }}>
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
        </Col>
      </div>
    );
  }
}

const UserProfilePageContentWithTheme = withTheme(UserProfilePageContent);

export default UserProfilePageContentWithTheme;
