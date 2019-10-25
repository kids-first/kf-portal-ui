import { Col, Divider, Input, Row, Typography } from 'antd';
import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';
import { Box } from 'uikit/Core';
import Icon from 'antd/es/icon';
import { H3 } from 'components/UserProfile/ui';
import { formatAddressLine } from 'common/displayFormatters';

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

const UserProfilePageContacts = props => {
  const {
    addressLine1,
    addressLine2,
    institution,
    city,
    country,
    state,
    phone,
    institutionalEmail,
    zip,
  } = props.profile;
  return (
    <UserProfilePageBox
      title={'Contact Information'}
      onSave={props.onSave}
      onCancel={props.onCancel}
      onEditClick={props.onEdit}
      isEditingBackgroundInfo={props.isEditingBackgroundInfo}
      canEdit={props.canEdit}
    >
      {(addressLine1 || addressLine2 || institution || city || country || state) && (
        <Row style={{ display: 'flex' }}>
          <Col>
            <Icon type="environment" theme="twoTone" />
          </Col>
          <Col>
            {institution && <Title level={3}>{institution}</Title>}
            <Row>{formatAddressLine([addressLine1, addressLine2])}</Row>
            <Row>{formatAddressLine([city, state, country])}</Row>
            {zip && <Row>{zip.toUpperCase()}</Row>}
          </Col>
        </Row>
      )}
      {institutionalEmail && ( //FIXME email-link|hoverable
        <Row style={{ display: 'flex' }}>
          <Col>
            <Icon type="mail" theme="twoTone" />
          </Col>
          <Col ml={'7px'}>
            <a  href="mailto:simonscientist@chop.edu">
              {institutionalEmail}
            </a>
          </Col>
        </Row>
      )}
      <Row />
    </UserProfilePageBox>
  );
};

export default UserProfilePageContacts;
