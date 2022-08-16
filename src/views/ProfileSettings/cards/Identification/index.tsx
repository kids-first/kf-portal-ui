import Gravatar from '@ferlab/ui/core/components/Gravatar';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { useKeycloak } from '@react-keycloak/web';
import { Alert, Col, Form, Input, Row, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { DEFAULT_GRAVATAR_PLACEHOLDER } from 'common/constants';
import { IncludeKeycloakTokenParsed } from 'common/tokenTypes';
import { capitalize } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from 'store/user/thunks';
import intl from 'react-intl-universal';
import { useUser } from 'store/user';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';

import styles from './index.module.scss';

enum FORM_FIELDS {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  PUBLIC_EMAIL = 'public_email',
  LINKEDIN = 'linkedin',
}

const initialChangedValues = {
  [FORM_FIELDS.FIRST_NAME]: false,
  [FORM_FIELDS.LAST_NAME]: false,
  [FORM_FIELDS.PUBLIC_EMAIL]: false,
  [FORM_FIELDS.LINKEDIN]: false,
};

const IdentificationCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { keycloak } = useKeycloak();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();
  const tokenParsed = keycloak.tokenParsed as IncludeKeycloakTokenParsed;

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.FIRST_NAME]: userInfo?.first_name,
      [FORM_FIELDS.LAST_NAME]: userInfo?.last_name,
      [FORM_FIELDS.PUBLIC_EMAIL]: userInfo?.public_email,
      [FORM_FIELDS.LINKEDIN]: userInfo?.linkedin,
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
  }, [userInfo]);

  return (
    <BaseCard
      form={form}
      title={intl.get('screen.profileSettings.cards.identification.title')}
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
    >
      <Space size={24} direction="vertical" className={styles.identificationCardContent}>
        <Alert
          showIcon
          type="info"
          message={intl.getHTML('screen.profileSettings.cards.identification.alert', {
            provider: capitalize(tokenParsed.identity_provider),
            email: userInfo?.email,
          })}
        />
        <Row gutter={24}>
          <Col span={16}>
            <BaseForm
              form={form}
              initialValues={initialValues}
              hasChangedInitialValue={hasChanged}
              onHasChanged={setHasChanged}
              onFinish={(values: any) =>
                dispatch(
                  updateUser({
                    data: values,
                  }),
                )
              }
            >
              <Form.Item
                name={FORM_FIELDS.FIRST_NAME}
                label={<ProLabel title="First Name" />}
                rules={[{ required: true, type: 'string', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input placeholder="Your First Name"></Input>
              </Form.Item>
              <Form.Item
                name={FORM_FIELDS.LAST_NAME}
                label={<ProLabel title="Last Name" />}
                rules={[{ required: true, type: 'string', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input placeholder="Your Last Name"></Input>
              </Form.Item>
              <Form.Item
                name={FORM_FIELDS.PUBLIC_EMAIL}
                requiredMark="optional"
                label={
                  
                  <ProLabel
                    title="Public Email"
                    popoverProps={{
                      placement: 'top',
                      overlayStyle: {
                        maxWidth: 250,
                      },
                      content:
                        'This email will be displayed on your profile page and accessible to all logged-in users of the portal.',
                    }}
                  />
                }
                rules={[{ type: 'email', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input placeholder="email@domain.com"></Input>
              </Form.Item>
              <Form.Item
                className="noMargin"
                name={FORM_FIELDS.LINKEDIN}
                label={<ProLabel title="Linkedin" />}
                rules={[{ type: 'url', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input placeholder="https://www.linkedin.com/in/username/"></Input>
              </Form.Item>
            </BaseForm>
          </Col>
          <Col span={8} className={styles.gravatarCol}>
            <div>
              <Gravatar
                circle
                placeholder={DEFAULT_GRAVATAR_PLACEHOLDER}
                className={styles.userGravatar}
                email={tokenParsed.email || tokenParsed.identity_provider_identity}
              />
            </div>
          </Col>
        </Row>
      </Space>
    </BaseCard>
  );
};

export default IdentificationCard;
