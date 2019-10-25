import React from 'react';
import { Col } from 'antd';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import UserProfilePageAboutMe from 'components/UserProfile/UserProfilePageAboutMe';

class UserProfilePageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingBackgroundInfo: false,
      bioTextarea: '',
      storyTextarea: '',
      value: '',
    };
  }

  componentDidMount() {
    this.setState({
      bioTextarea: this.props.profile.bio,
      storyTextarea: this.props.profile.story,
    });
  }

  static propTypes = {
    profile: PropTypes.object,
    loggedInUser: PropTypes.object,
    // api: PropTypes.
    onSubmitUpdateProfile: PropTypes.func.isRequired,
    canEdit: PropTypes.func.isRequired,
    theme: PropTypes.object,
  };

  onChange = tags => event => {
    const obj = {
      [tags]: event.target.value,
    };
    this.setState(obj);
  };

  onSave = () => {
    this.props.onSubmitUpdateProfile({
      bio: this.state.bioTextarea,
      story: this.state.storyTextarea,
    });
    this.setState({ isEditingBackgroundInfo: false });
  };

  onCancel = () => {
    this.setState({ isEditingBackgroundInfo: false });
  };

  onEditClick = () => {
    this.setState({ isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo });
  };

  render() {
    const { bioTextarea, storyTextarea, isEditingBackgroundInfo } = this.state;
    return (
      <div>
        <Col span={14} style={{ padding:5 }}>
          <UserProfilePageAboutMe
            bioTextarea={bioTextarea}
            storyTextarea={storyTextarea}
            isEditingBackgroundInfo={isEditingBackgroundInfo}
            onChange={this.onChange}
            onSave={this.onSave}
            onCancel={this.onCancel}
            onEdit={this.onEditClick}
            canEdit={this.props.canEdit}
            theme={this.props.theme}
          />
        </Col>
        <Col span={10} />
      </div>
    );
  }
}

const UserProfilePageContentWithTheme = withTheme(UserProfilePageContent);

export default UserProfilePageContentWithTheme;
