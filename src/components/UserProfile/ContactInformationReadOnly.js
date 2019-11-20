import React from 'react';
import PropTypes from 'prop-types';
import { Col, Divider, Row, Typography } from 'antd';
import capitalize from 'lodash/capitalize';

const { Text } = Typography;

const keyToLabel = {
  email: 'email',
  addressLine1: 'address',
  institution: 'institution',
  city: 'city',
  country: 'country',
  state: 'state',
  phone: 'phone',
  institutionalEmail: 'institutional email',
  zip: 'zip code',
};

const fromKeyToLabel = key => {
  if (Object.prototype.hasOwnProperty.call(keyToLabel, key)) {
    return keyToLabel[key];
  }
  return key;
};

const ContactInformationReadOnly = props => {
  const { data } = props;
  // eslint-disable-next-line no-unused-vars
  const { findMe, ...dataExceptFindMe } = data;
  const dataSize = Object.keys(dataExceptFindMe).length;
  const lastIndex = dataSize - 1;
  return Object.entries(dataExceptFindMe).map(([key, val], index) => {
    const isNotLast = index !== lastIndex;
    return (
      <React.Fragment key={index}>
        <Row type={'flex'} justify="space-between" align="bottom">
          <Col span={4}>
            <Text>{capitalize(fromKeyToLabel(key))}</Text>
          </Col>
          <Col span={8}>
            <Text style={Boolean(val) ? null : { fontStyle: 'italic' }}>
              {val || 'Edit Card to Add Details'}
            </Text>
          </Col>
        </Row>
        {isNotLast && <Divider style={{ margin: '18px 0' }} />}
      </React.Fragment>
    );
  });
};

ContactInformationReadOnly.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ContactInformationReadOnly;
