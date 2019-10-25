import React, { useState } from 'react';
import { Button, Card, Col, Divider, Icon, Input, Row, Typography } from 'antd';
import { withTheme } from 'emotion-theming';
import PropTypes from 'prop-types';
import { TRACKING_EVENTS } from 'services/analyticsTracking';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Box = props => (
  <Col
    span={24}
    style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 10 }}
  >
    <Row align="middle">
      <Col span={20}>
        <Title level={2}>{props.title}</Title>
      </Col>
      <Col span={4}>
        {props.canEdit &&
          (props.isEditingBackgroundInfo ? (
            <Row>
              <Button
                type="primary"
                shape="round"
                icon="save"
                size={'small'}
                onClick={props.onSave}
              >
                Save
              </Button>
              <Button type="default" shape="round" icon="close" size={'small'} onClick={props.onCancel}>
                Cancel
              </Button>
            </Row>
          ) : (
            <Icon
              type="edit"
              theme="twoTone"
              style={{ fontSize: 20 }}
              onClick={props.onEditClick}
            />
          ))}
      </Col>
    </Row>
    <Row>{props.children}</Row>
  </Col>
);

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

  onChange = tags => (event) => {
    const obj = {
      [tags]: event.target.value
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

  onStart = () => {
    console.log('start');
  };

  render() {
    console.log('props', this.props);
    const { bioTextarea, storyTextarea, isEditingBackgroundInfo } = this.state;
    return (
      <div>
        <Col span={14}>
          <Row type="flex" justify="space-around" align="middle">
            <Box
              title={'Profile'}
              onSave={this.onSave}
              onCancel={this.onCancel}
              onEditClick={this.onEditClick}
              isEditingBackgroundInfo={isEditingBackgroundInfo}
              canEdit={this.props.canEdit}
            >
              <Row>
                <Title level={3}>My Bio</Title>
                {isEditingBackgroundInfo ? (
                  <TextArea
                    placeholder="Autosize height based on content lines"
                    onChange={this.onChange("bioTextarea")}
                    defaultValue={bioTextarea}
                    disabled={ !isEditingBackgroundInfo }
                    // value={bioTextarea}
                    autoSize={true}
                  />
                ):(
                  <Text editable={false} style={{whiteSpace: "pre-wrap"}}>
                    {this.props.profile.bio}
                  </Text>
                )}
              </Row>
              <Divider />
              <Row>
                <Title level={3}>My Story</Title>
                {isEditingBackgroundInfo ? (
                  <TextArea
                    placeholder="Autosize height based on content lines"
                    onChange={this.onChange('storyTextarea')}
                    defaultValue={storyTextarea}
                    disabled={ !isEditingBackgroundInfo }
                    // value={bioTextarea}
                    autoSize={true}
                  />
                ):(
                  <Text editable={false} style={{whiteSpace: "pre-wrap"}}>
                    {this.props.profile.story}
                  </Text>
                )}
              </Row>
            </Box>
          </Row>
        </Col>
        <Col span={10} />
      </div>
    );
  }
}

const UserProfilePageContentWithTheme = withTheme(UserProfilePageContent);

export default UserProfilePageContentWithTheme;
