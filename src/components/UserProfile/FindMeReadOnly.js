import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { socialItems } from 'components/UserProfile/utils';
import { List, Row, Typography } from 'antd';

const { Title, Text } = Typography;

const FindMeReadOnly = props => {
  const { findMe } = props;
  const { keys, prototype } = Object;
  if (isEmpty(findMe)) {
    return (
      <Text
        style={{
          fontStyle: 'italic',
          borderLeft: '1px solid rgb(237,238,241)',
          marginTop: '144px',
          paddingLeft: '48px',
        }}
      >
        {` Click Edit to add links to your personal channels such as Google Scholar, ORCID ID, GitHub, LinkedIn, Twitter and Facebook.`}
      </Text>
    );
  }

  const socialItemsWithSized = socialItems();
  const userSocialItems = keys(socialItemsWithSized)
    .filter(key => prototype.hasOwnProperty.call(findMe, key))
    .map(key => ({ ...socialItemsWithSized[key], value: findMe[key] }));

  return (
    <div style={{ borderLeft: '1px solid rgb(237,238,241)', paddingLeft: '48px' }}>
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
      <Row>
        <List
          size="large"
          itemLayout="horizontal"
          dataSource={userSocialItems}
          renderItem={item => {
            const { service, icon, value, href } = item;
            return (
              <List.Item>
                <List.Item.Meta avatar={icon} title={<a href={href(value)}>{service}</a>} />
              </List.Item>
            );
          }}
        />
      </Row>
    </div>
  );
};

FindMeReadOnly.propTypes = {
  findMe: PropTypes.object.isRequired,
};

export default FindMeReadOnly;
