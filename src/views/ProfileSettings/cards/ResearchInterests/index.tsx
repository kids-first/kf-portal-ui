import { Form, Select, Tag, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef, useState } from 'react';
import { AreaOfInterestOptions } from 'views/Community/contants';
import { useDispatch } from 'react-redux';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';
import { usePersona } from 'store/persona';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import intl from 'react-intl-universal';
import { updatePersonaUser } from 'store/persona/thunks';

enum FORM_FIELDS {
  INTERESTS = 'interests',
}

const initialChangedValues = {
  [FORM_FIELDS.INTERESTS]: false,
};

const ResearchInterestsCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();
  const [interestsFilter, setInterestsFilter] = useState<string[]>([]);

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
    setInterestsFilter([]);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.INTERESTS]: personaUserInfo?.interests || [],
    };
    setInterestsFilter(personaUserInfo?.interests || []);
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaUserInfo]);

  return (
    <BaseCard
      form={form}
      title={intl.get('screen.profileSettings.cards.researchInterests.title')}
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
    >
      <BaseForm
        form={form}
        onHasChanged={setHasChanged}
        initialValues={initialValues}
        hasChangedInitialValue={hasChanged}
        onFinish={(values: any) => {
          dispatch(
            updatePersonaUser({
              data: {
                ...personaUserInfo,
                interests: values[FORM_FIELDS.INTERESTS],
              },
              callback: () => {
                initialValues.current = values;
                setHasChanged(initialChangedValues);
              },
            }),
          );
        }}
      >
        <Form.Item
          name={FORM_FIELDS.INTERESTS}
          label={
            <ProLabel
              title={intl.get('screen.profileSettings.cards.researchInterests.interests')}
            />
          }
          required={false}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={intl.get('screen.community.search.selectPlaceholder')}
            maxTagCount={4}
            onSelect={(value: string) => setInterestsFilter([...interestsFilter, value])}
            onDeselect={(value: string) =>
              setInterestsFilter(interestsFilter.filter((val) => val !== value))
            }
            options={AreaOfInterestOptions.map((option) => ({
              label: option.value,
              value: option.value.toLocaleLowerCase(),
            }))}
            tagRender={({ onClose, value }) => (
              <Tag closable onClose={onClose} style={{ marginRight: 3 }}>
                <Typography.Text>{value}</Typography.Text>
              </Tag>
            )}
          />
        </Form.Item>
      </BaseForm>
    </BaseCard>
  );
};

export default ResearchInterestsCard;
