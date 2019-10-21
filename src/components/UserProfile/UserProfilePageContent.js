import React, { useState } from 'react';
import { Card, Col, Icon, Input, Row, Typography } from 'antd';
import { ClickToAdd } from 'components/UserProfile/ui';
import EditableLabel from 'uikit/EditableLabel';
import { withTheme } from 'emotion-theming';
import { trackProfileInteraction } from 'services/analyticsTracking';

const { Title, Text } = Typography;
const { Meta } = Card;
const { TextArea } = Input;

const Box = props => (
  <Card
    className={`height-${props.value}`}
    style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 10 }}
  >
    <Meta
      className={'text-color-dark'}
      title={<Title level={2}>Profile</Title>}
    />
    {props.children}
  </Card>
);

const gridStyle = {
  width: '100%',
  textAlign: 'left',
};

const handleEditingBackgroundInfo = ({ setEditingBackgroundInfo }) => ({ type, value }) => {
  setEditingBackgroundInfo(value);
  trackProfileInteraction({ action: 'Profile', value, type });
};

const UserProfilePageContent = ({
  profile,
  loggedInUser,
  api,
  onSummitUpdateProfile,
  canEdit,
  theme,
}) => {
  const [isEditingBackgroundInfo, setEditingBackgroundInfo] = useState(false);
  const [focusedTextArea, setFocusedTextArea] = useState('myBio');
  const [bioTextarea, setBioTextarea] = useState(profile.bio || ''); //FIXME

  return (
    <div>
      {console.log(profile, 'profile')}
      <Col span={14}>
        <Row type="flex" justify="space-around" align="middle">
          <Box value={100}>
            <Card
              style={gridStyle}
              extra={<Icon type="edit" theme="twoTone"  style={{fontSize: '20px', color: '#08c', cursor: 'pointer' }} />}
            >
              <Meta
                title={<Title level={3}>My Bio</Title>}
              />
              {(profile.bio === '' || isEditingBackgroundInfo) && canEdit && (
                <Text>
                  Share information about your professional background and your research interests.
                </Text>
              )}
              <TextArea />
            </Card>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
          </Box>
        </Row>
      </Col>
      <Col span={10} />
    </div>
  );
};

UserProfilePageContent.propTypes = {
  // profile: PropTypes.object.isRequired,
  // onSummitUpdateProfile: PropTypes.func.isRequired,
  // canEdit: PropTypes.bool.isRequired,
};
const UserProfilePageContentWithTheme = withTheme(UserProfilePageContent);

export default UserProfilePageContentWithTheme;
