import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';
import { Form, Icon, Input, Row } from 'antd';
import WebsiteIcon from 'icons/WebsiteIcon';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import orchidIcon from 'assets/icon-findemeon-orchid.png';
import * as Yup from 'yup';
import List from 'antd/es/list';

const HeartSvg = () => <img alt="ORCHID" src={orchidIcon} height={28} />;

const socialItems = [
  {
    type: 'website',
    icon: <WebsiteIcon style={{ height: 28, width: 28 }} />,
    name: 'Website URL:',
    placeholder: 'e.g. kidsfirstdrc.org',
  },
  {
    type: 'googleScholarId',
    icon: <GoogleScholarIcon style={{ height: 28, width: 28 }} />,
    name: 'Google Scholar URL:',
    placeholder: 'e.g. scholar.google.com/citations?user=CsD2_4MAAAAJ',
  },
  {
    type: 'linkedin',
    icon: <Icon type={'linkedin'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'LinkedIn URL:',
    placeholder: 'e.g. linkedin.com/in/acresnick',
  },
  {
    type: 'facebook',
    icon: <Icon type={'facebook'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'Facebook URL:',
    placeholder: 'e.g. facebook.com/kidsfirstDRC',
  },
  {
    type: 'twitter',
    icon: <Icon type={'twitter'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'Twitter handle/username:',
    placeholder: 'e.g. @kidsfirstDRC',
    href: v => `https://twitter.com/${v}`,
    linkText: v => `@${v}`,
  },
  {
    type: 'github',
    icon: <Icon type={'github'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'Github username:',
    placeholder: 'e.g. kids-first',
    href: v => `https://github.com/${v}`,
  },
  {
    type: 'orchid',
    icon: <HeartSvg style={{ height: 28, width: 28 }} />,
    name: 'ORCID ID:',
    placeholder: 'e.g. 0000-0003-0436-4189',
    href: v => `https://orcid.org/${v}`,
  },
];

const transformURL = value => {
  return value.length && value.indexOf('http://') !== 0 && value.indexOf('https://') !== 0
    ? `https://${value}`
    : value;
};

const SocialLinksSchema = Yup.object().shape({
  website: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  googleScholarId: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  linkedin: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  facebook: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  twitter: Yup.string()
    .trim()
    .transform(v => (v.length && v.indexOf('@') === 0 ? v.slice(1) : v)),
  github: Yup.string().trim(),
  orchid: Yup.string().trim(),
});

class UserProfilePageFindMe extends React.Component {
  state = {
    isEditingBackgroundInfo: false,
  };

  onEditClick = () => {
    this.setState({ isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo });
  };

  onCancel = () => {
    this.setState({ isEditingBackgroundInfo: false, interests: this.props.interests });
  };

  render() {
    const { isEditingBackgroundInfo } = this.state;
    return (
      <UserProfilePageBox
        title={'Find me on'}
        onSave={this.handleSave}
        onCancel={this.onCancel}
        onEditClick={this.onEditClick}
        isEditingBackgroundInfo={this.state.isEditingBackgroundInfo}
        canEdit={this.props.canEdit}
      >
        <List
          dataSource={ isEditingBackgroundInfo ? socialItems : socialItems.filter(p => this.props.profile[p.type]) }
          renderItem={item => (
            <List.Item>
              {isEditingBackgroundInfo ? (
                <List.Item.Meta
                  title={item.name}
                  description={<Input addonBefore={item.icon} placeholder={item.placeholder} />}
                />
              ) : (
                <List.Item.Meta
                  title={item.name}
                  description={<Row>
                    {item.icon}
                    <a href="/docs/spec/proximity">Principles</a>
                  </Row>}
                />
              )}
            </List.Item>
          )}
        />
      </UserProfilePageBox>
    );
  }
}

export default UserProfilePageFindMe;
