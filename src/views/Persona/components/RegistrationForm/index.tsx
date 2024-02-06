import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Space, Typography } from 'antd';
import { memberRolesOptions } from 'views/Community/contants';

import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { createPersonaUser } from 'store/persona/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.scss';

const { Title, Text } = Typography;

interface OwnProps {
  hidden?: boolean;
  handleBack: () => void;
  kcToken: KidsFirstKeycloakTokenParsed;
  onFinishCallback: () => void;
}

const Registration = ({ handleBack, hidden = true, kcToken, onFinishCallback }: OwnProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleCancel = () => navigate(STATIC_ROUTES.LOGIN);
  const handleSubmit = () => form.submit();

  const inlineStyle = hidden ? { display: 'none' } : {};

  const onFinish = (values: any) => {
    dispatch(
      createPersonaUser({
        egoId: kcToken.sub,
        firstName: values.firstName,
        lastName: values.lastName,
        acceptedTerms: true,
        email: kcToken.email,
        roles: values.roles!,
        acceptedKfOptIn: values?.subscribing?.includes('acceptedKfOptIn')!,
        acceptedDatasetSubscriptionKfOptIn: values?.subscribing?.includes(
          'acceptedDatasetSubscriptionKfOptIn',
        )!,
      }),
    );
    onFinishCallback();
  };

  return (
    <div className={styles.mainWrapper} style={inlineStyle}>
      <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Space direction="vertical" size={16} className={styles.termsAndConditionsWrapper}>
          <Title level={3}>Identification</Title>
          <Text>All fields are required unless specified as optional.</Text>
          <Form.Item
            label={intl.get('screen.profileSettings.cards.identification.firstName')}
            name="firstName"
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.get('screen.profileSettings.cards.identification.lastName')}
            name="lastName"
            rules={[{ required: true, message: 'Last name is required' }]}
          >
            <Input />
          </Form.Item>

          <Title level={3} className={styles.title}>
            Role & Affiliation
          </Title>
          <Form.Item
            name="roles"
            label={intl.get('screen.profileSettings.cards.roleAffiliation.role')}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Checkbox.Group>
              <Space direction="vertical" size={8}>
                <div>Check all that apply</div>
                {memberRolesOptions.map(({ key, value }) => (
                  <Checkbox value={key}>{value}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="subscribing" label="Keeping in touch">
            <Checkbox.Group>
              <Space direction="vertical" size={8}>
                <Checkbox value="acceptedKfOptIn">
                  I would like to receive the Kids First Data Resource Center quarterly newsletter
                  to get the latest DRC news including recent study updates, new investigators and
                  partners added to the effort.
                </Checkbox>
                <Checkbox value="acceptedDatasetSubscriptionKfOptIn">
                  The Gabriella Miller Kids First Data Resource Center is constantly improving the
                  availability and quality of new datasets added to the Data Resource Portal. Sign
                  up below to opt-in to receive updates and announcements when new datasets are
                  available in the Portal.
                </Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Row justify="space-between">
            <Button onClick={handleBack}>
              <ArrowLeftOutlined />
              Back
            </Button>
            <Space size={16}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type={'primary'} onClick={handleSubmit}>
                Submit
              </Button>
            </Space>
          </Row>
        </Space>
      </Form>
    </div>
  );
};

export default Registration;
