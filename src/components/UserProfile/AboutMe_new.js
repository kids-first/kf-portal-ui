import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col } from 'antd';
import ContactReadOnly from 'components/UserProfile/ContactReadOnly';
import ContactEditForm from 'components/UserProfile/ContactEditForm';
import EditToggle from 'components/UserProfile/EditToggle';
import ProfileReadOnly from './ProfileReadOnly';

const { Content } = Layout;

const filterContactInfoFromProfile = profile => {
  const keepKeys = [
    'addressLine1',
    'institution',
    'city',
    'country',
    'state',
    'phone',
    'institutionalEmail',
    'zip',
  ];
  const { fromEntries, entries } = Object;
  return fromEntries(entries(profile).filter(([key]) => keepKeys.includes(key)));
};

const AboutMe = props => {
  const { canEdit, profile } = props;
  return (
    <Layout style={{ padding: '25px' }}>
      <Content>
        <Row>
          <Col span={24}>
            <EditToggle
              data={filterContactInfoFromProfile(profile)}
              canEdit={canEdit}
              ReadOnlyComponent={ProfileReadOnly}
              EditableComponent={<div/>}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <EditToggle
              data={filterContactInfoFromProfile(profile)}
              canEdit={canEdit}
              ReadOnlyComponent={ContactReadOnly}
              EditableComponent={ContactEditForm}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

AboutMe.propTypes = {
  canEdit: PropTypes.bool.isRequired,
};

export default AboutMe;
