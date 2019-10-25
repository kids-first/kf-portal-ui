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
        <Icon type="edit" theme="twoTone" style={{ fontSize: 20 }} onClick={props.onEditClick} />
      </Col>
    </Row>
    <Row>{props.children}</Row>
    {
      props.isEditingBackgroundInfo ? (
        <Row>
          <Button type="primary" shape="round" icon="save" size={'small'} onClick={props.onSave}>
            Save
          </Button>
          <Button type="default" shape="round" icon="close" size={'small'}>
            Cancel
          </Button>
        </Row>
      ):''
    }
  </Col>
);

class UserProfilePageContent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isEditingBackgroundInfo: false,
      bioTextarea: '',
      storyTextarea: '',
      value:'',
    }
  }

  componentDidMount(){
    this.setState({
      bioTextarea: this.props.profile.bio,
      storyTextarea: this.props.profile.story
    })
  }



  static propTypes = {
    profile: PropTypes.object,
    loggedInUser: PropTypes.object,
    // api: PropTypes.
    onSubmitUpdateProfile: PropTypes.func.isRequired,
    canEdit: PropTypes.func.isRequired,
    theme: PropTypes.object,
  };

  onChange = ({ target: { value } }) => {
    this.setState({ bioTextarea: value });
  };

  onSave = () => {
    this.props.onSubmitUpdateProfile({
      bio: this.state.bioTextarea,
      story: this.state.storyTextarea,
    });
  };

  onEditClick = () => {
    this.setState({isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo})
  };

  onStart = () => {
    console.log("start")
  };

  render() {
    const { bioTextarea, storyTextarea }  = this.state;
    return (
      <div>
        <Col span={14}>
          <Row type="flex" justify="space-around" align="middle">
            <Box title={'Profile'} onSave={this.onSave} onEditClick={this.onEditClick} isEditingBackgroundInfo={this.state.isEditingBackgroundInfo}>
              <Row>
                <Title level={3}>My Bio</Title>
                <TextArea
                  placeholder="Autosize height based on content lines"
                  onChange={this.onChange}
                  defaultValue={this.props.profile.bio}
                  value={bioTextarea}
                  autoSize={true}
                />
              </Row>
              <Divider />
              <Row>
                <Title level={3}>My Story</Title>
                <TextArea
                  placeholder="Autosize height based on content lines"
                  onChange={this.onChange}
                  defaultValue={storyTextarea}
                />
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
