import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Form, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';

import { IUserSetOutput, SetType } from 'services/api/savedSet/models';
import { PROJECT_ID, useSavedSet } from 'store/savedSet';
import { updateSavedSet } from 'store/savedSet/thunks';

import { SetActionType, singularizeSetTypeIfNeeded } from './index';
import UserSetsForm from './UserSetForm';

const FORM_NAME = 'add-remove-set';

type OwnProps = {
  idField: string;
  hideModalCb: Function;
  userSets: IUserSetOutput[];
  sqon?: ISqonGroupFilter;
  setActionType: SetActionType;
  type: SetType;
};

const finishButtonText = (type: string) => {
  switch (type) {
    case SetActionType.ADD_IDS:
      return 'Add to set';
    case SetActionType.REMOVE_IDS:
      return 'Remove from set';
    default:
      break;
  }
};

const formTitle = (setActionType: string, type: SetType) => {
  switch (setActionType) {
    case SetActionType.ADD_IDS:
      return intl.get('components.savedSets.modal.add.title', {
        type: singularizeSetTypeIfNeeded(type).toLocaleLowerCase(),
      });
    case SetActionType.REMOVE_IDS:
      return intl.get('components.savedSets.modal.remove.title', {
        type: singularizeSetTypeIfNeeded(type).toLocaleLowerCase(),
      });
    default:
      break;
  }
};

const AddRemoveSaveSetModal = ({
  idField,
  hideModalCb,
  userSets,
  setActionType,
  sqon,
  type,
}: OwnProps) => {
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(true);
  const [hasSetSelection, setHasSetSelection] = useState(false);
  const { isUpdating } = useSavedSet();
  const dispatch = useDispatch();

  const onSuccessCreateCb = () => {
    setIsVisible(false);
    hideModalCb();
  };

  const onSelectionChange = (value: string) => {
    setHasSetSelection(!!value);
  };

  const onFinish = async (values: Store) => {
    const { setId } = values;
    switch (setActionType) {
      case SetActionType.ADD_IDS:
      case SetActionType.REMOVE_IDS:
        dispatch(
          updateSavedSet({
            id: setId,
            subAction: setActionType,
            idField,
            projectId: PROJECT_ID,
            sqon: sqon!,
            onCompleteCb: onSuccessCreateCb,
          }),
        );
        break;
      default:
        setIsVisible(false);
        hideModalCb();
        break;
    }
  };

  const onCancel = () => {
    setIsVisible(false);
    hideModalCb();
  };

  return (
    <Modal
      title={formTitle(setActionType, type)}
      open={isVisible}
      onCancel={onCancel}
      okText={finishButtonText(setActionType)}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: !hasSetSelection, loading: isUpdating }}
    >
      <UserSetsForm
        userSets={userSets.filter((s) => s.setType === type)}
        form={form}
        formName={FORM_NAME}
        onFinish={onFinish}
        onSelectionChange={onSelectionChange}
        type={type}
      />
    </Modal>
  );
};

export default AddRemoveSaveSetModal;
