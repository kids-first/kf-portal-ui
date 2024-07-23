import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import CommunityProfileGridCard from '@ferlab/ui/core/pages/CommunityPage/CommunityProfileGridCard';
import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import BaseForm from 'views/Profile/Settings/cards/BaseForm';

import { useUser } from 'store/user';
import { updateUser } from 'store/user/thunks';

enum FORM_FIELDS {
  STATE = 'location_state',
  COUNTRY = 'location_country',
}

const initialChangedValues = {
  [FORM_FIELDS.STATE]: false,
  [FORM_FIELDS.COUNTRY]: false,
};

const LocationCard = () => {
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
      [FORM_FIELDS.STATE]: userInfo?.location_state || '',
      [FORM_FIELDS.COUNTRY]: userInfo?.location_country || '',
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
  }, [form, userInfo]);

  return (
    <CommunityProfileGridCard
      form={form}
      title={intl.get('screen.profileSettings.cards.location.title')}
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
      loading={isLoading}
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
                location_state: values[FORM_FIELDS.STATE],
                location_country: values[FORM_FIELDS.COUNTRY],
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
    </CommunityProfileGridCard>
  );
};

export default LocationCard;
