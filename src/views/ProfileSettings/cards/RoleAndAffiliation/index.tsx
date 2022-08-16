import { Checkbox, Form, Input, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef, useState } from 'react';
import { useUser } from 'store/user';
import { roleOptions } from 'views/Community/contants';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { updateUser } from 'store/user/thunks';
import formStyles from '../form.module.scss';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';
import { OTHER_KEY, removeOtherKey } from '../utils';

enum FORM_FIELDS {
  ROLES = 'roles',
  OTHER_ROLE = 'other_role',
  AFFILIATION = 'affiliation',
  NO_AFFILIATION = 'no_affiliation',
  RESEARCH_AREA = 'reasearch_area',
}

const hasOtherRole = (userRoles: string[]) =>
  userRoles.find((role) => !roleOptions.find((defaultRole) => defaultRole === role));

const initialChangedValues = {
  [FORM_FIELDS.ROLES]: false,
  [FORM_FIELDS.OTHER_ROLE]: false,
  [FORM_FIELDS.AFFILIATION]: false,
  [FORM_FIELDS.NO_AFFILIATION]: false,
  [FORM_FIELDS.RESEARCH_AREA]: false,
};

const RoleAndAffiliationCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.ROLES]: hasOtherRole(userInfo?.roles ?? [])
        ? [...(userInfo?.roles ?? []), OTHER_KEY]
        : userInfo?.roles,
      [FORM_FIELDS.OTHER_ROLE]: hasOtherRole(userInfo?.roles ?? []),
      [FORM_FIELDS.AFFILIATION]: userInfo?.affiliation,
      [FORM_FIELDS.NO_AFFILIATION]: !userInfo?.affiliation,
      [FORM_FIELDS.RESEARCH_AREA]: userInfo?.research_area || '',
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
  }, [userInfo]);

  return (
    <BaseCard
      form={form}
      title="Role & Affiliation"
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
                roles: removeOtherKey(values[FORM_FIELDS.ROLES], values[FORM_FIELDS.OTHER_ROLE]),
                affiliation: values[FORM_FIELDS.NO_AFFILIATION]
                  ? ''
                  : values[FORM_FIELDS.AFFILIATION],
                research_area: values[FORM_FIELDS.RESEARCH_AREA],
              },
            }),
          )
        }
      >
        <Form.Item
          className={formStyles.withCustomHelp}
          name={FORM_FIELDS.ROLES}
          label="I am a:"
          required={false}
          rules={[{ required: true }]}
        >
          <Checkbox.Group className={formStyles.checkBoxGroup}>
            <span className={formStyles.help}>Check all that apply</span>
            <Space direction="vertical">
              {roleOptions.map((option, index) => (
                <Checkbox key={index} value={option}>
                  {option}
                </Checkbox>
              ))}
              <Checkbox value={OTHER_KEY}>Other</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[FORM_FIELDS.ROLES] !== currentValues[FORM_FIELDS.ROLES]
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(FORM_FIELDS.ROLES)?.includes(OTHER_KEY) ? (
              <Form.Item
                className={formStyles.dynamicField}
                name={FORM_FIELDS.OTHER_ROLE}
                label="Please describe"
                required={false}
                rules={[{ required: true, validateTrigger: 'onSubmit' }]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[FORM_FIELDS.NO_AFFILIATION] !== currentValues[FORM_FIELDS.NO_AFFILIATION]
          }
        >
          {({ getFieldValue }) =>
            !getFieldValue(FORM_FIELDS.NO_AFFILIATION) ? (
              <Form.Item
                className={cx(formStyles.withCustomHelp, formStyles.affiliationField)}
                label="I am affiliated with:"
              >
                <span className={formStyles.help}>
                  Provide institutional or organizational affiliation
                </span>
                <Form.Item
                  name={FORM_FIELDS.AFFILIATION}
                  className={formStyles.noMargin}
                  required={false}
                  rules={[{ required: true, validateTrigger: 'onSubmit' }]}
                >
                  <Input />
                </Form.Item>
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[FORM_FIELDS.NO_AFFILIATION] !== currentValues[FORM_FIELDS.NO_AFFILIATION]
          }
        >
          {() => (
            <Form.Item
              name={FORM_FIELDS.NO_AFFILIATION}
              label={form.getFieldValue(FORM_FIELDS.NO_AFFILIATION) ? 'I am affiliated with:' : ''}
              className={cx(
                formStyles.withCustomHelp,
                form.getFieldValue(FORM_FIELDS.NO_AFFILIATION) && formStyles.noAffiliationField,
              )}
              rules={[{ required: false }]}
              valuePropName="checked"
            >
              <Checkbox>I do not have an institutional affiliation.</Checkbox>
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item
          className={cx(
            formStyles.withCustomHelp,
            formStyles.researchAreaField,
            formStyles.noMargin,
          )}
          label="My research area or area of interest may best be described as:"
          requiredMark="optional"
        >
          <span className={formStyles.help}>
            Provide a brief description and a link to your professional biography or organization
            website, if available
          </span>
          <Form.Item name={FORM_FIELDS.RESEARCH_AREA} className={formStyles.noMargin}>
            <Input.TextArea />
          </Form.Item>
        </Form.Item>
      </BaseForm>
    </BaseCard>
  );
};

export default RoleAndAffiliationCard;
