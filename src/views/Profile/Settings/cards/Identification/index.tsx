import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import Gravatar from '@ferlab/ui/core/components/Gravatar';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import CommunityProfileGridCard from '@ferlab/ui/core/pages/CommunityPage/CommunityProfileGridCard';
import { useKeycloak } from '@react-keycloak/web';
import { Alert, Col, Form, Input, Row, Skeleton, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { formatProvider } from 'auth/keycloak-api/utils';
import BaseForm from 'views/Profile/Settings/cards/BaseForm';

import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { useUser } from 'store/user';
import { updateUser } from 'store/user/thunks';

import ToggleProfileVisibility from './ToggleProfileVisibility';

import styles from './index.module.css';

enum FORM_FIELDS {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
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
  const { userInfo, isLoading } = useUser();
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
      [FORM_FIELDS.FIRST_NAME]: userInfo?.first_name,
      [FORM_FIELDS.LINKEDIN]: userInfo?.linkedin,
      [FORM_FIELDS.LAST_NAME]: userInfo?.last_name,
      [FORM_FIELDS.WEBSITE]: userInfo?.website,
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
  }, [form, userInfo]);

  return (
    <CommunityProfileGridCard
      loading={isLoading}
      customSkeleton={
        <Space align="center" className={styles.skeletonWrapper}>
          <Space direction="vertical" className={styles.skeleton}>
            <Skeleton paragraph={{ rows: 1 }} title={false} active />
            <Skeleton paragraph={{ rows: 1 }} title={false} active />
            <Skeleton.Input block active />
            <Skeleton paragraph={{ rows: 1 }} title={false} active />
            <Skeleton.Input block active />
            <Skeleton paragraph={{ rows: 1 }} title={false} active />
            <Skeleton.Input block active />
            <Skeleton paragraph={{ rows: 1 }} title={false} active />
            <Skeleton.Input block active />
          </Space>
          <Space align="center" className={styles.skeleton}>
            <Skeleton.Avatar className={styles.avatar} size={140} />
          </Space>
        </Space>
      }
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
            email: userInfo?.email || tokenParsed.email || tokenParsed.identity_provider_identity,
            id: userInfo?.email ? 'email' : 'ID',
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
                    data: {
                      ...userInfo,
                      first_name: values[FORM_FIELDS.FIRST_NAME],
                      last_name: values[FORM_FIELDS.LAST_NAME],
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
              id={`${userInfo?.first_name}${userInfo?.last_name}`}
            />
          </Col>
        </Row>
      </Space>
    </CommunityProfileGridCard>
  );
};

export default IdentificationCard;
