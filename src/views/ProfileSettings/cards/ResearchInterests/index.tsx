import { Form, Select, Tag, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef, useState } from 'react';
import { diseasesInterestOptions, studiesInterestOptions } from 'views/Community/contants';
import { useDispatch } from 'react-redux';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';
import { usePersona } from 'store/persona';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import intl from 'react-intl-universal';
import { updatePersonaUser } from 'store/persona/thunks';

enum FORM_FIELDS {
  DISEASES = 'diseases',
  STUDIES = 'studies',
}

const initialChangedValues = {
  [FORM_FIELDS.DISEASES]: false,
  [FORM_FIELDS.STUDIES]: false,
};

const ResearchInterestsCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();
  const [diseasesInterestFilter, setDiseasesInterestFilter] = useState<string[]>([]);
  const [studiesInterestFilter, setStudiesInterestFilter] = useState<string[]>([]);

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
    setDiseasesInterestFilter([]);
    setStudiesInterestFilter([]);
  };

  useEffect(() => {
    const diseasesInterests = personaUserInfo?.interests?.filter((interest) =>
      diseasesInterestOptions.some((disease) => disease.value.toLocaleLowerCase() === interest),
    );
    const studiesInterests = personaUserInfo?.interests?.filter((interest) =>
      studiesInterestOptions.some((study) => study.value.toLocaleLowerCase() === interest),
    );
    initialValues.current = {
      [FORM_FIELDS.DISEASES]: diseasesInterests || [],
      [FORM_FIELDS.STUDIES]: studiesInterests || [],
    };
    setDiseasesInterestFilter(diseasesInterests || []);
    setStudiesInterestFilter(studiesInterests || []);
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
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
                interests: values[FORM_FIELDS.DISEASES].concat(values[FORM_FIELDS.STUDIES]),
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
          name={FORM_FIELDS.DISEASES}
          label={
            <ProLabel title={intl.get('screen.profileSettings.cards.researchInterests.diseases')} />
          }
          required={false}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={intl.get('screen.community.search.selectPlaceholder')}
            maxTagCount={4}
            onSelect={(value: string) =>
              setDiseasesInterestFilter([...diseasesInterestFilter, value])
            }
            onDeselect={(value: string) =>
              setDiseasesInterestFilter(diseasesInterestFilter.filter((val) => val !== value))
            }
            options={diseasesInterestOptions.map((option) => ({
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
        <Form.Item
          name={FORM_FIELDS.STUDIES}
          label={
            <ProLabel title={intl.get('screen.profileSettings.cards.researchInterests.studies')} />
          }
          required={false}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={intl.get('screen.community.search.selectPlaceholder')}
            maxTagCount={4}
            onSelect={(value: string) =>
              setStudiesInterestFilter([...studiesInterestFilter, value])
            }
            onDeselect={(value: string) =>
              setStudiesInterestFilter(studiesInterestFilter.filter((val) => val !== value))
            }
            options={studiesInterestOptions.map((option) => ({
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
