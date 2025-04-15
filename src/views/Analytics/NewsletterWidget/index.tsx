import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Button, Card, Input, Typography } from 'antd';
import Form from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';

import logo1 from 'components/assets/analytics/newsletterWidget1.svg';
import logo2 from 'components/assets/analytics/newsletterWidget2.svg';
import logo3 from 'components/assets/analytics/newsletterWidget3.svg';
import { subscribeNewsletter } from 'store/user/thunks';

import styles from './index.module.css';

const { Title, Paragraph } = Typography;

const NewsletterWidget = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);

  const handleSumbit = async (values: any) => {
    setIsSubscribing(true);
    const { newsletter_email } = values;

    if (newsletter_email !== '') {
      await dispatch(
        subscribeNewsletter({
          data: {
            newsletter_email,
          },
        }),
      );
      setIsSubscribing(false);
      form.resetFields();
    }
  };

  return (
    <Card className={styles.widget}>
      <div className={styles.spaceWrapper}>
        <div className={styles.icons}>
          <img alt="Logo circles" src={logo1} />
          <img alt="Logo line chart" src={logo2} />
          <img alt="Logo bar chart" src={logo3} />
        </div>
        <div className={styles.content}>
          <Title level={5}>{intl.get('screen.analytics.newsletter.title')}</Title>
          <Paragraph className={styles.description}>
            {intl.get('screen.analytics.newsletter.description')}
          </Paragraph>
        </div>
        <div className={styles.form}>
          <Form
            form={form}
            initialValues={{ newsletter_email: '' }}
            layout="inline"
            onFinish={handleSumbit}
            validateMessages={{
              required: intl.get('global.forms.errors.requiredField'),
              types: {
                email: intl.get('global.forms.errors.enterValidEmail'),
              },
            }}
          >
            <FormItem
              name="newsletter_email"
              rules={[{ required: true, type: 'email' }]}
              style={{ marginRight: '8px', flexGrow: 1 }}
            >
              <Input placeholder={intl.get('screen.analytics.newsletter.form.placeholder')} />
            </FormItem>
            <Form.Item style={{ marginRight: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubscribing}
                loading={isSubscribing}
              >
                {intl.get('screen.analytics.newsletter.form.buttonLabel')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  );
};

export default NewsletterWidget;
