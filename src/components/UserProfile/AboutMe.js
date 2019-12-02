import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col } from 'antd';
import ContactReadOnly from 'components/UserProfile/ContactReadOnly';
import ContactEditForm from 'components/UserProfile/ContactEditForm';
import EditToggle from 'components/UserProfile/EditToggle';
import ProfileReadOnly from './ProfileReadOnly';
import ProfileEditable from './ProfileEditable';

const { Content } = Layout;

const AboutMe = props => {
  const { canEdit, profile, updateProfileCb, isProfileUpdating } = props;
  return (
    <Layout className={'am-main-layout'}>
      <Content>
        <Row align={'middle'} className={'am-profile-row'}>
          <Col span={24}>
            <EditToggle
              isProfileUpdating={isProfileUpdating}
              data={profile}
              canEdit={canEdit}
              ReadOnlyComponent={ProfileReadOnly}
              EditableComponent={ProfileEditable}
              updateProfileCb={updateProfileCb}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <EditToggle
              isProfileUpdating={isProfileUpdating}
              data={profile}
              canEdit={canEdit}
              ReadOnlyComponent={ContactReadOnly}
              EditableComponent={ContactEditForm}
              updateProfileCb={updateProfileCb}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

AboutMe.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  updateProfileCb: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
};

export default AboutMe;
