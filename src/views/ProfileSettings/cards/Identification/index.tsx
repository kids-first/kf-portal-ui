import Gravatar from '@ferlab/ui/core/components/Gravatar';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { useKeycloak } from '@react-keycloak/web';
import { Alert, Col, Form, Input, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';

import styles from './index.module.scss';
import { usePersona } from 'store/persona';
import { updatePersonaUser } from 'store/persona/thunks';
import ToggleProfileVisibility from './ToggleProfileVisibility';
import { formatProvider } from 'auth/keycloak-api/utils';

enum FORM_FIELDS {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  LINKEDIN = 'linkedin',
  WEBSITE = 'website',
}

const initialChangedValues = {
  [FORM_FIELDS.FIRST_NAME]: false,
  [FORM_FIELDS.LAST_NAME]: false,
  [FORM_FIELDS.LINKEDIN]: false,
  [FORM_FIELDS.WEBSITE]: false,
};

const IdentificationCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
  const { keycloak } = useKeycloak();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();
  const tokenParsed = keycloak.tokenParsed as KidsFirstKeycloakTokenParsed;

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.FIRST_NAME]: personaUserInfo?.firstName,
      [FORM_FIELDS.LAST_NAME]: personaUserInfo?.lastName,
      [FORM_FIELDS.LINKEDIN]: personaUserInfo?.linkedin,
      [FORM_FIELDS.WEBSITE]: personaUserInfo?.website,
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaUserInfo]);

  return (
    <BaseCard
      form={form}
      customHeader={
        <div className={styles.customHeader}>
          <Typography.Title className={styles.title} level={4}>
            {intl.get('screen.profileSettings.cards.identification.title')}
          </Typography.Title>
          <ToggleProfileVisibility />
        </div>
      }
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
    >
      <Space size={24} direction="vertical" className={styles.identificationCardContent}>
        <Alert
          showIcon
          type="info"
          message={intl.getHTML('screen.profileSettings.cards.identification.alert', {
            provider: formatProvider(tokenParsed.identity_provider),
            email: personaUserInfo?.email || tokenParsed.identity_provider,
            id: personaUserInfo?.email ? 'email' : 'ID',
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
                  updatePersonaUser({
                    data: {
                      ...personaUserInfo,
                      firstName: values[FORM_FIELDS.FIRST_NAME],
                      lastName: values[FORM_FIELDS.LAST_NAME],
                      linkedin: values[FORM_FIELDS.LINKEDIN],
                      website: values[FORM_FIELDS.WEBSITE],
                    },
                    callback: () => {
                      initialValues.current = values;
                      setHasChanged(initialChangedValues);
                    },
                  }),
                )
              }
            >
              <Form.Item
                name={FORM_FIELDS.FIRST_NAME}
                label={
                  <ProLabel
                    title={intl.get('screen.profileSettings.cards.identification.firstName')}
                  />
                }
                rules={[{ required: true, type: 'string', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input
                  placeholder={intl.get(
                    'screen.profileSettings.cards.identification.yourFirstName',
                  )}
                />
              </Form.Item>
              <Form.Item
                name={FORM_FIELDS.LAST_NAME}
                label={
                  <ProLabel
                    title={intl.get('screen.profileSettings.cards.identification.lastName')}
                  />
                }
                rules={[{ required: true, type: 'string', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input
                  placeholder={intl.get('screen.profileSettings.cards.identification.yourLastName')}
                />
              </Form.Item>
              <Form.Item
                name={FORM_FIELDS.LINKEDIN}
                label={<ProLabel title="LinkedIn" />}
                rules={[{ type: 'url', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input placeholder="https://www.linkedin.com/in/username/" />
              </Form.Item>
              <Form.Item
                className="noMargin"
                name={FORM_FIELDS.WEBSITE}
                label={
                  <ProLabel
                    title={intl.get('screen.profileSettings.cards.identification.website')}
                  />
                }
                rules={[{ type: 'url', validateTrigger: 'onSubmit' }]}
                required={false}
              >
                <Input placeholder="https://domain.com/username" />
              </Form.Item>
            </BaseForm>
          </Col>
          <Col span={8} className={styles.gravatarCol}>
            <Gravatar
              circle
              className={styles.userGravatar}
              email={tokenParsed.email || tokenParsed.identity_provider_identity}
            />
          </Col>
        </Row>
      </Space>
    </BaseCard>
  );
};

export default IdentificationCard;
