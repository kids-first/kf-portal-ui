import React, { ReactElement } from 'react';
import { Avatar, Row, Space, Typography } from 'antd';
import isEmpty from 'lodash/isEmpty';

import { socialItems } from 'components/UserProfile/utils';

import './style.css';

const { Text, Paragraph } = Typography;

type FindMe = {
  website: string;
  googleScholarId: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  github: string;
  orchid: string;
  [index: string]: string;
};

type Props = {
  findMe: Partial<FindMe>;
};

type SocialIcons = {
  [index: string]: {
    icon: ReactElement;
    name: string;
    placeholder: string;
    type: string;
    service: string;
    href: (url: string | undefined) => string;
  };
};

const FindMeReadOnly = (props: Props) => {
  const { findMe } = props;
  const { keys, prototype } = Object;

  if (isEmpty(findMe)) {
    return (
      <Paragraph className={'find-me-text-if-empty'}>
        {` Click Edit to add links to your personal channels such as` +
          `Google Scholar, ORCID ID, GitHub, LinkedIn, Twitter and Facebook.`}
      </Paragraph>
    );
  }

  const socialItemsWithSized: SocialIcons = socialItems();
  const userSocialItems = keys(socialItemsWithSized)
    .filter((key) => prototype.hasOwnProperty.call(findMe, key))
    .map((key) => ({ ...socialItemsWithSized[key], value: findMe[key] }));

  return (
    <div className={'find-me-social-icons-wrapper'}>
      <Row>
        <Text className={'section-text'}>Find me on...</Text>
      </Row>
      <br />
      <Space direction={'vertical'} size={'middle'}>
        {userSocialItems.map(({ service, icon, value, href }, index) => (
          <Space key={index} align={'center'}>
            <Avatar icon={icon} />
            <a target="_blank" rel="noopener noreferrer" href={href(value)}>
              {service}
            </a>
          </Space>
        ))}
      </Space>
    </div>
  );
};

export default FindMeReadOnly;
