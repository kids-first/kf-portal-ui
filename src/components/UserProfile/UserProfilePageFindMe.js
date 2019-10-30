import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';
import { Form, Icon, Input, Row, Typography } from 'antd';
import WebsiteIcon from 'icons/WebsiteIcon';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import orchidIcon from 'assets/icon-findemeon-orchid.png';
import List from 'antd/es/list';

const { Title } = Typography;
const HeartSvg = () => <img alt="ORCHID" src={orchidIcon} height={28} />;

const socialItems = [
  {
    type: 'website',
    icon: <WebsiteIcon style={{ height: 28, width: 28 }} />,
    name: 'Website URL:',
    placeholder: 'e.g. kidsfirstdrc.org',
    rules: [
      {
        type: 'url',
        message: 'Must be a valid URL...',
      },
    ],
  },
  {
    type: 'googleScholarId',
    icon: <GoogleScholarIcon style={{ height: 28, width: 28 }} />,
    name: 'Google Scholar URL:',
    placeholder: 'e.g. scholar.google.com/citations?user=CsD2_4MAAAAJ',
    rules: [
      {
        type: 'url',
        message: 'Must be a valid URL...',
      },
    ],
  },
  {
    type: 'linkedin',
    icon: <Icon type={'linkedin'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'LinkedIn URL:',
    placeholder: 'e.g. linkedin.com/in/acresnick',
    rules: [
      {
        type: 'url',
        message: 'Must be a valid URL...',
      },
    ],
  },
  {
    type: 'facebook',
    icon: <Icon type={'facebook'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'Facebook URL:',
    placeholder: 'e.g. facebook.com/kidsfirstDRC',
    rules: [
      {
        type: 'url',
        message: 'Must be a valid URL...',
      },
    ],
  },
  {
    type: 'twitter',
    icon: <Icon type={'twitter'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'Twitter handle/username:',
    placeholder: 'e.g. @kidsfirstDRC',
    href: v => `https://twitter.com/${v}`,
    linkText: v => `@${v}`,
    rules: [],
  },
  {
    type: 'github',
    icon: <Icon type={'github'} style={{ fontSize: 28, height: 28, width: 28 }} />,
    name: 'Github username:',
    placeholder: 'e.g. kids-first',
    href: v => `https://github.com/${v}`,
    rules: [],
  },
  {
    type: 'orchid',
    icon: <HeartSvg style={{ height: 28, width: 28 }} />,
    name: 'ORCID ID:',
    placeholder: 'e.g. 0000-0003-0436-4189',
    href: v => `https://orcid.org/${v}`,
  },
];

const types = socialItems.map(item => item.type);

class UserProfilePageFindMe extends React.Component {
  state = {
    isEditingBackgroundInfo: false,
    values: {},
  };

  componentDidMount() {
    const initialValues = {};
    types.map(item => (initialValues[item] = this.props.profile[item]));
    this.setState({ values: initialValues });
  }

  onEditClick = () => {
    this.setState({ isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo });
  };

  onCancel = () => {
    this.setState({ isEditingBackgroundInfo: false, interests: this.props.interests });
  };

  onChange = name => e => {
    const newValues = { ...this.state.values, [name]: e.target.value };
    this.setState({ values: newValues });
  };

  handleSave = errors => () => {
    if (!errors) {
      this.props.onSave(this.state.values);
      this.setState({ isEditingBackgroundInfo: false });
    }
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const { isEditingBackgroundInfo, values } = this.state;
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const validationErrors = getFieldsError();
    const hasError = this.hasErrors(validationErrors);

    return (
      <UserProfilePageBox
        title={'Find me on'}
        onSave={this.handleSave(hasError)}
        onCancel={this.onCancel}
        onEditClick={this.onEditClick}
        isEditingBackgroundInfo={isEditingBackgroundInfo}
        canEdit={this.props.canEdit}
        canSave={hasError}
      >
        {this.props.canEdit &&
          !isEditingBackgroundInfo &&
          !Object.values(values).filter(Boolean).length && (
            <Title level={4}>
              Add links to your personal channels such as Google Scholar, ORCID ID, GitHub,
              LinkedIn, Twitter and Facebook.
            </Title>
          )}
        {isEditingBackgroundInfo ? (
          <Form>
            {socialItems.map(item => (
              <Form.Item label={item.name}>
                {getFieldDecorator(item.name, {
                  initialValue: values[item.type],
                  rules: item.rules,
                })(
                  <Input
                    addonBefore={item.icon}
                    placeholder={item.placeholder}
                    onChange={this.onChange(item.type)}
                  />,
                )}
              </Form.Item>
            ))}
          </Form>
        ) : (
          <List
            dataSource={socialItems.filter(p => this.props.profile[p.type])}
            renderItem={item => (
              <List.Item key={1}>
                <List.Item.Meta
                  title={item.name}
                  description={
                    <Row>
                      {item.icon}
                      <a href={item.href ? item.href : this.props.profile[item.type]}>
                        <Icon type={'export'} />
                        {item.linkText
                          ? item.linkText(this.props.profile[item.type])
                          : this.props.profile[item.type]}
                      </a>
                    </Row>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </UserProfilePageBox>
    );
  }
}

const WrappedUserProfilePageFindMe = Form.create()(UserProfilePageFindMe);

export default WrappedUserProfilePageFindMe;
