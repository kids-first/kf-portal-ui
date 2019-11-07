import { Input, Row, Typography } from 'antd';
import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';

const { Title, Text } = Typography;
const { TextArea } = Input;

const h4 = theme => {
  return {
    fontFamily: theme.fonts.details,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 1.85,
    textAlign: 'left',
    color: theme.greyScale9,
    margin: 0,
    padding: 0,
    fontWeight: 'normal',
  };
};

class UserProfilePageAboutMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bioTextarea: '',
      storyTextarea: '',
      isEditingBackgroundInfo: false,
    };
  }

  componentDidMount() {
    this.setState({
      bioTextarea: this.props.bioTextarea,
      storyTextarea: this.props.storyTextarea,
    });
  }

  onCancel = () => {
    this.setState({ isEditingBackgroundInfo: false });
  };

  onEditClick = () => {
    this.setState({ isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo });
  };

  handleSave = () => {
    this.props.onSave({
      bio: this.state.bioTextarea,
      story: this.state.storyTextarea,
    });

    this.setState({ isEditingBackgroundInfo: false });
  };

  onChange = tags => event => {
    const obj = {
      [tags]: event.target.value,
    };
    this.setState(obj);
  };

  render() {
    const { isEditingBackgroundInfo } = this.state;

    return (
      <UserProfilePageBox
        title={'Profile'}
        onSave={this.handleSave}
        onCancel={this.onCancel}
        onEditClick={this.onEditClick}
        isEditingBackgroundInfo={this.state.isEditingBackgroundInfo}
        canEdit={this.props.canEdit}
      >
        <Row>
          <Title level={3}>My Bio</Title>
          {(this.props.storyTextarea === '' || isEditingBackgroundInfo) && this.props.canEdit && (
            <Title style={h4(this.props.theme)} level={4}>
              Share information about your professional background and your research interests.
            </Title>
          )}
          {isEditingBackgroundInfo ? (
            <TextArea
              placeholder="Autosize height based on content lines"
              onChange={this.onChange('bioTextarea')}
              defaultValue={this.props.bioTextarea}
              disabled={!isEditingBackgroundInfo}
              // value={bioTextarea}
              autoSize={true}
            />
          ) : (
            <Text editable={false} style={{ whiteSpace: 'pre-wrap' }}>
              {this.props.bioTextarea}
            </Text>
          )}
        </Row>
        <Row>
          <Title level={3}>My Story</Title>
          {(this.props.storyTextarea === '' || isEditingBackgroundInfo) && this.props.canEdit && (
            <Title level={4} style={h4(this.props.theme)}>
              Share why you’re a part of the Kids First community.
            </Title>
          )}
          {isEditingBackgroundInfo ? (
            <TextArea
              placeholder="Autosize height based on content lines"
              onChange={this.onChange('storyTextarea')}
              defaultValue={this.props.storyTextarea}
              disabled={!isEditingBackgroundInfo}
              // value={bioTextarea}
              autoSize={true}
            />
          ) : (
            <Text editable={false} style={{ whiteSpace: 'pre-wrap' }}>
              {this.props.storyTextarea}
            </Text>
          )}
        </Row>
      </UserProfilePageBox>
    );
  }
}

export default UserProfilePageAboutMe;
