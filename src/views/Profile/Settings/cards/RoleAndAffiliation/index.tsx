import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import CommunityProfileGridCard from '@ferlab/ui/core/pages/CommunityPage/CommunityProfileGridCard';
import { Checkbox, Form, Input, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ROLE_OPTIONS } from 'views/Community/constants';
import BaseForm from 'views/Profile/Settings/cards/BaseForm';

import { useUser } from 'store/user';
import { updateUser } from 'store/user/thunks';

import formStyles from '../form.module.css';

enum FORM_FIELDS {
  ROLES = 'roles',
  AFFILIATION = 'affiliation',
}

const initialChangedValues = {
  [FORM_FIELDS.ROLES]: false,
  [FORM_FIELDS.AFFILIATION]: false,
};

const RoleAndAffiliationCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useUser();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.ROLES]: userInfo?.roles,
      [FORM_FIELDS.AFFILIATION]: userInfo?.affiliation || '',
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
  }, [form, userInfo]);

  return (
    <CommunityProfileGridCard
      form={form}
      loading={isLoading}
      title={intl.get('screen.profileSettings.cards.roleAffiliation.title')}
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
    >
      <BaseForm
        form={form}
        onHasChanged={setHasChanged}
        initialValues={initialValues}
        hasChangedInitialValue={hasChanged}
        onFinish={(values: any) =>
          dispatch(
            updateUser({
              data: {
                ...userInfo,
                roles: values[FORM_FIELDS.ROLES],
                affiliation: values[FORM_FIELDS.AFFILIATION],
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
          name={FORM_FIELDS.AFFILIATION}
          label={
            <ProLabel
              title={intl.get('screen.profileSettings.cards.roleAffiliation.institution')}
            />
          }
        >
          <Input />
        </Form.Item>
        <Form.Item
          className={formStyles.withCustomHelp}
          name={FORM_FIELDS.ROLES}
          label={intl.get('screen.profileSettings.cards.roleAffiliation.role')}
          rules={[{ required: true }]}
        >
          <Checkbox.Group className={formStyles.checkBoxGroup}>
            <span className={formStyles.help}>
              {intl.get('screen.profileSettings.cards.roleAffiliation.checkAllThatApply')}
            </span>
            <Space direction="vertical">
              {ROLE_OPTIONS.map(({ label, value }) => (
                <Checkbox key={value} value={value}>
                  {label}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </BaseForm>
    </CommunityProfileGridCard>
  );
};

export default RoleAndAffiliationCard;
