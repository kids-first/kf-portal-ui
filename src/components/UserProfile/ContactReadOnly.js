import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Divider, Card, Button, Typography, Anchor } from 'antd';
import { SOCIAL_ITEMS } from 'components/UserProfile/utils';
import isEmpty from 'lodash/isEmpty';
const { Title, Text } = Typography;

const { Link } = Anchor;

const generateRows = rawData => {
  // eslint-disable-next-line no-unused-vars
  const { findMe, ...data } = rawData;
  const dataSize = Object.keys(data).length;
  const lastIndex = dataSize - 1;
  return Object.entries(data).map(([key, val], index) => {
    const isNotLast = index !== lastIndex;
    return (
      <React.Fragment key={index}>
        <Row type={'flex'} justify="space-between" align="bottom">
          <Col span={4}>
            <Text>{key}</Text>
          </Col>
          <Col span={8}>
            <Text>{val || 'Edit Card to Add Details'}</Text>
          </Col>
        </Row>
        {isNotLast && <Divider style={{ margin: '18px 0' }} />}
      </React.Fragment>
    );
  });
  //TODO: create a mapping from key to label
};

const generateFindMeOn = findMe => {
  const { keys, prototype, entries } = Object;
  if (isEmpty(findMe)) {
    return (
      <Fragment>
        <Text>
          {` Click Edit to add links to your personal channels such as Google Scholar, ORCID ID, GitHub, LinkedIn, Twitter and Facebook.`}
        </Text>
        {entries(SOCIAL_ITEMS)
          .filter(([itemName]) => itemName !== 'website') //show only meaningful/public icons
          .map(([itemName, item]) => {
            const { icon } = item;
            return <Row key={itemName}>{icon}</Row>;
          })}
      </Fragment>
    );
  }

  const userSocialItems = keys(SOCIAL_ITEMS)
    .filter(key => prototype.hasOwnProperty.call(findMe, key))
    .map(key => ({ ...SOCIAL_ITEMS[key], value: findMe[key] }));

  return (
    <Fragment>
      <Row>
        <Title
          level={4}
          style={{
            color: 'rgb(43, 56, 143)',
          }}
        >
          Find me on...
        </Title>
      </Row>
      {userSocialItems.map(item => {
        const { service, icon, value, name } = item;
        return (
          <Row key={name}>
            <Col span={8}>{icon}</Col>
            <Col span={16}>
              <Anchor>
                <Link href={value} title={service} />
              </Anchor>
            </Col>
          </Row>
        );
      })}
    </Fragment>
  );
};

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb } = props;
  return (
    <Card
      title={
        <Title
          level={3}
          style={{
            color: 'rgb(43, 56, 143)',
          }}
        >
          Contact Information
        </Title>
      }
      style={{
        width: '1000px',
        borderRadius: '10px',
      }}
      headStyle={{
        color: 'rgb(43, 56, 143)',
        backgroundColor: 'rgb(237,238,241)',
        paddingBottom: '14px',
        paddingTop: '14px',
        paddingLeft: '32px',
        paddingRight: '32px',
      }}
      bodyStyle={{
        padding: '32px',
      }}
      extra={
        canEdit ? (
          <Button
            style={{ color: 'white', backgroundColor: '#90278e' }}
            icon="edit"
            shape="round"
            onClick={onClickEditCb}
          >
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={16} style={{ paddingRight: '48px' }}>
          {generateRows(data)}
        </Col>
        <Col
          span={8}
          style={{
            borderLeft: '1px solid rgb(237,238,241)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {generateFindMeOn(data.findMe)}
        </Col>
      </Row>
    </Card>
  );
};

ContactReadOnly.propTypes = {
  data: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onClickEditCb: PropTypes.func.isRequired,
};

export default ContactReadOnly;
