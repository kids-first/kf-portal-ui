import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';
import { usePersona } from 'store/persona';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { updatePersonaUser } from 'store/persona/thunks';

enum FORM_FIELDS {
  STATE = 'state',
  COUNTRY = 'country',
}

const initialChangedValues = {
  [FORM_FIELDS.STATE]: false,
  [FORM_FIELDS.COUNTRY]: false,
};

const LocationCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.STATE]: personaUserInfo?.state || '',
      [FORM_FIELDS.COUNTRY]: personaUserInfo?.country || '',
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaUserInfo]);

  return (
    <BaseCard
      form={form}
      title={intl.get('screen.profileSettings.cards.location.title')}
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
            updatePersonaUser({
              data: {
                ...personaUserInfo,
                state: values[FORM_FIELDS.STATE],
                country: values[FORM_FIELDS.COUNTRY],
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
          name={FORM_FIELDS.COUNTRY}
          label={<ProLabel title={intl.get('screen.profileSettings.cards.location.country')} />}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={FORM_FIELDS.STATE}
          label={<ProLabel title={intl.get('screen.profileSettings.cards.location.state')} />}
        >
          <Input />
        </Form.Item>
      </BaseForm>
    </BaseCard>
  );
};

export default LocationCard;
