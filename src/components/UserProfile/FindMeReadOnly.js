import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { socialItems } from 'components/UserProfile/utils';
import { List, Row, Typography } from 'antd';
import './style.css';

const { Text, Paragraph } = Typography;

const FindMeReadOnly = props => {
  const { findMe } = props;
  const { keys, prototype } = Object;
  if (isEmpty(findMe)) {
    return (
      <Paragraph className={'find-me-text-if-empty'}>
        {` Click Edit to add links to your personal channels such as Google Scholar, ORCID ID, GitHub, LinkedIn, Twitter and Facebook.`}
      </Paragraph>
    );
  }

  const socialItemsWithSized = socialItems();
  const userSocialItems = keys(socialItemsWithSized)
    .filter(key => prototype.hasOwnProperty.call(findMe, key))
    .map(key => ({ ...socialItemsWithSized[key], value: findMe[key] }));

  return (
    <div className={'find-me-social-icons-wrapper'}>
      <Row>
        <Text className={'section-text'}>Find me on...</Text>
      </Row>
      <br />
      <Row>
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={userSocialItems}
          renderItem={item => {
            const { service, icon, value, href } = item;
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={icon}
                  title={
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={href(value)}
                      style={{ color: '#90278e' }}
                    >
                      {service}
                    </a>
                  }
                />
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
