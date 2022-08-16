import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { createSavedSet, updateSavedSet } from 'store/savedSet/thunks';
import filtersToName from 'common/sqonToName';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import intl from 'react-intl-universal';
import { PROJECT_ID, useSavedSet } from 'store/savedSet';
import { SetActionType } from 'views/DataExploration/components/SetsManagementDropdown';
import { IUserSetOutput, SetType } from 'services/api/savedSet/models';

import styles from './index.module.scss';
import { WarningFilled } from '@ant-design/icons';
import { MAX_TITLE_LENGTH } from 'views/DataExploration/components/PageContent';

const FORM_NAME = 'save-set';
const SET_NAME_KEY = 'nameSet';

type OwnProps = {
  title: string;
  visible?: boolean;
  saveSetActionType: SetActionType;
  hideModalCb?: Function;
  sqon?: ISqonGroupFilter;
  setType: SetType;
  currentSaveSet?: IUserSetOutput;
  hasSelectedKeys?: boolean;
};

const CreateEditModal = ({
  sqon,
  hideModalCb,
  title,
  saveSetActionType,
  setType,
  visible = true,
  currentSaveSet,
  hasSelectedKeys = false,
}: OwnProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(visible);
  const { isLoading, isUpdating, savedSets } = useSavedSet();

  const onSuccessCreateCb = () => {
    setIsVisible(false);
    hideModalCb && hideModalCb();
  };

  useEffect(() => {
    if (visible !== isVisible) {
      setIsVisible(visible);
    }
    // eslint-disable-next-line
  }, [visible]);

  const isSetNameExists = (setName: string) => {
    const existingTagNames = savedSets.map((s) => s.tag);

    return existingTagNames.filter((title) => currentSaveSet?.tag !== title).includes(setName);
  };

  const onFinish = async (value: Store) => {
    const { nameSet } = value;

    if (isSetNameExists(nameSet)) {
      form.setFields([
        {
          name: SET_NAME_KEY,
          errors: ['A set with this name already exists'],
        },
      ]);
    } else {
      if (saveSetActionType === SetActionType.UPDATE_SET && currentSaveSet) {
        dispatch(
          updateSavedSet({
            onCompleteCb: onSuccessCreateCb,
            id: currentSaveSet?.id,
            subAction: SetActionType.RENAME_TAG,
            newTag: nameSet,
          }),
        );
      } else {
        dispatch(
          createSavedSet({
            idField: 'fhir_id',
            projectId: PROJECT_ID,
            sort: [],
            sqon: sqon!,
            tag: nameSet,
            type: setType,
            onCompleteCb: onSuccessCreateCb,
          }),
        );
      }
    }
  };

  const resolveConflictNames = (name: string) => {
    let existsName = isSetNameExists(name);
    let newName = name;
    if (existsName) {
      do {
        newName = `${newName}(copy)`;
        existsName = isSetNameExists(newName);
      } while (existsName && newName.length < MAX_TITLE_LENGTH);
    }
    return newName;
  };

  const getSetDefaultName = (formValue: string) => {
    if (SetActionType.UPDATE_SET && currentSaveSet) {
      return currentSaveSet.tag;
    }

    if (isLoading) {
      return formValue;
    }

    if (hasSelectedKeys) {
      let newName = `${setType.charAt(0).toUpperCase() + setType.slice(1)} Set`;
      return resolveConflictNames(newName);
    }

    return resolveConflictNames(filtersToName({ filters: sqon }));
  };

  const handleCancel = () => {
    setIsVisible(false);
    form.resetFields();
    hideModalCb && hideModalCb();
  };

  return (
    <Modal
      title={title}
      visible={isVisible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: isLoading, loading: isLoading || isUpdating }}
      okText="Save"
      destroyOnClose
    >
      <Form
        form={form}
        name={FORM_NAME}
        layout="vertical"
        onFinish={onFinish}
        fields={[
          {
            name: [SET_NAME_KEY],
            value: getSetDefaultName(form.getFieldValue(SET_NAME_KEY)),
          },
        ]}
        validateMessages={{
          required: intl.get('global.forms.errors.requiredField'),
        }}
      >
        <Form.Item
          label="Name"
          className={styles.setCreateFormItem}
          name={SET_NAME_KEY}
          rules={[
            {
              type: 'string',
              max: MAX_TITLE_LENGTH,
              message: (
                <span>
                  <WarningFilled /> {MAX_TITLE_LENGTH}{' '}
                  {intl.get('components.querybuilder.header.modal.edit.input.maximumLength')}
                </span>
              ),
              validateTrigger: 'onSubmit',
            },
            {
              type: 'string',
              required: true,
              message: intl.get('global.forms.errors.requiredField'),
              validateTrigger: 'onSubmit',
            },
          ]}
          required={false}
        >
          <Input autoFocus placeholder="Enter the name of your new set" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditModal;
