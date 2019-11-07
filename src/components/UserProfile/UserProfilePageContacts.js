import { Col, Row, Typography } from 'antd';
import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';
import Icon from 'antd/es/icon';
import { formatAddressLine } from 'common/displayFormatters';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { withApi } from 'services/api';
import { compose } from 'recompose';
import { injectState } from 'freactal';

const { Title } = Typography;

class UserProfilePageContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingBackgroundInfo: false,
    };
  } //FIXME

  onEditClick = () => {
    const { api } = this.props;
    this.props.effects.setModal({
      title: 'Edit Basic Information',
      component: <BasicInfoForm {...{ api }} />,
    });
  };

  render() {
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
    } = this.props.profile; //TODO Maybe just send the address

    return (
      <UserProfilePageBox
        title={'Contact Information'}
        onSave={this.handleSave}
        onCancel={this.onCancel}
        onEditClick={this.onEditClick}
        isEditingBackgroundInfo={this.state.isEditingBackgroundInfo}
        canEdit={this.props.canEdit}
      >
        {(addressLine1 || addressLine2 || institution || city || country || state) && (
          <Row style={{ display: 'flex' }}>
            <Col>
              <Icon type="environment" theme="twoTone" />
            </Col>
            <Col style={{ paddingLeft: 10 }}>
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
            <Col ml={'7px'} style={{ paddingLeft: 10 }}>
              <a href="mailto:simonscientist@chop.edu">{institutionalEmail}</a>
            </Col>
          </Row>
        )}
        {phone && (
          <Row style={{ display: 'flex' }}>
            <Col>
              <Icon type="phone" theme="twoTone" />
            </Col>
          </Row>
        )}
      </UserProfilePageBox>
    );
  }
}
const UserProfilePageContactsEnhanced = compose(
  injectState,
  withApi,
)(UserProfilePageContacts);

export default UserProfilePageContactsEnhanced;
