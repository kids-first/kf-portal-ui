import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import CommunityProfileGridCard from '@ferlab/ui/core/pages/CommunityPage/CommunityProfileGridCard';
import { Form, Select, Tag, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { AREA_OF_INTEREST } from 'views/Community/constants';
import BaseForm from 'views/Profile/Settings/cards/BaseForm';

import { useUser } from 'store/user';
import { updateUser } from 'store/user/thunks';

enum FORM_FIELDS {
  INTERESTS = 'areas_of_interest',
}

const initialChangedValues = {
  [FORM_FIELDS.INTERESTS]: false,
};

const ResearchInterestsCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useUser();
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
    const mappedInterests = (userInfo?.areas_of_interest || []).map(
      (interest) => AREA_OF_INTEREST.find((e) => e.toLocaleLowerCase() === interest) || interest,
    );

    initialValues.current = {
      [FORM_FIELDS.INTERESTS]: mappedInterests || [],
    };
    setInterestsFilter(mappedInterests || []);
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
  }, [form, userInfo]);

  return (
    <CommunityProfileGridCard
      form={form}
      title={intl.get('screen.profileSettings.cards.researchInterests.title')}
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
      loading={isLoading}
    >
      <BaseForm
        form={form}
        onHasChanged={setHasChanged}
        initialValues={initialValues}
        hasChangedInitialValue={hasChanged}
        onFinish={(values: any) => {
          dispatch(
            updateUser({
              data: {
                ...userInfo,
                areas_of_interest: values[FORM_FIELDS.INTERESTS],
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
            options={AREA_OF_INTEREST.map((option) => ({
              label: option,
              value: option,
            }))}
            tagRender={({ onClose, label }) => (
              <Tag closable onClose={onClose} style={{ marginRight: 3 }}>
                <Typography.Text>{label}</Typography.Text>
              </Tag>
            )}
          />
        </Form.Item>
      </BaseForm>
    </CommunityProfileGridCard>
  );
};

export default ResearchInterestsCard;
