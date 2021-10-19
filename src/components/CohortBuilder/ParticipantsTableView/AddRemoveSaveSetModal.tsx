/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Form, Modal, notification } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { AxiosResponse } from 'axios';

import UserSetsFrom from 'components/CohortBuilder/UserSetsForm';
import { withApi } from 'services/api';
import { addRemoveSetIds } from 'store/actionCreators/saveSets';
import { Api, ApiConfig } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import {
  AddRemoveSetParams,
  DispatchSaveSets,
  SaveSetState,
  SetSubActionTypes,
} from 'store/saveSetTypes';
import { selectIsEditingSets, selectSets } from 'store/selectors/saveSetsSelectors';
import { Sqon } from 'store/sqon';
import { User } from 'store/userTypes';

import './AddRemoveSaveSetModal.css';

const FORM_NAME = 'add-remove-set';

type OwnProps = {
  hideModalCb: Function;
  user: User;
  sqon: Sqon;
  subActionType: SetSubActionTypes;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: selectSets(state),
    isLoading: false,
    error: null,
    isDeleting: false,
    isEditing: selectIsEditingSets(state),
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onAddRemoveSetIds: (
    api: (config: ApiConfig) => Promise<AxiosResponse>,
    params: AddRemoveSetParams,
  ) => dispatch(addRemoveSetIds(api, params)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps & Api;

const finishButtonText = (type: string) => {
  switch (type) {
    case SetSubActionTypes.ADD_IDS:
      return 'Add to set';
    case SetSubActionTypes.REMOVE_IDS:
      return 'Remove from set';
    default:
      break;
  }
};

const formTitle = (type: string) => {
  switch (type) {
    case SetSubActionTypes.ADD_IDS:
      return 'Add to a participant set';
    case SetSubActionTypes.REMOVE_IDS:
      return 'Remove from a participant set';
    default:
      break;
  }
};

const AddRemoveSaveSetModal: FunctionComponent<Props> = (props) => {
  const { hideModalCb, subActionType, userSets, user, onAddRemoveSetIds, sqon, api } = props;
  const [isVisible, setIsVisible] = useState(true);

  const onFinish = async (values: Store) => {
    const { setId } = values;
    switch (subActionType) {
      case SetSubActionTypes.ADD_IDS:
        onAddRemoveSetIds(api, {
          setId: setId,
          userId: user.egoId,
          subActionType: SetSubActionTypes.ADD_IDS,
          sqon: sqon,
          type: 'participant',
          path: 'kf_id',
          onSuccess: () => {
            notification.success({
              message: 'Success',
              description: `The participants were added to the set.`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
          onFail: () => {
            notification.error({
              message: 'Error',
              description: `Adding participants to this set has failed`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
        });
        break;
      case SetSubActionTypes.REMOVE_IDS:
        onAddRemoveSetIds(api, {
          setId: setId,
          userId: user.egoId,
          subActionType: SetSubActionTypes.REMOVE_IDS,
          sqon: sqon,
          type: 'participant',
          path: 'kf_id',
          onSuccess: () => {
            notification.success({
              message: 'Success',
              description: `The participants were removed from the set.`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
          onFail: () => {
            notification.error({
              message: 'Error',
              description: `Removing participants from this set has failed`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
        });
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

  const [form] = Form.useForm();

  return (
    <Modal
      title={formTitle(subActionType)}
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Form.Item key={'submit'} noStyle>
          <Button
            id="EditSaveSets"
            form={FORM_NAME}
            htmlType="submit"
            key="save"
            type="primary"
            loading={userSets.isEditing}
          >
            {finishButtonText(subActionType)}
          </Button>
        </Form.Item>,
      ]}
    >
      <UserSetsFrom form={form} formName={FORM_NAME} onFinish={onFinish} />
    </Modal>
  );
};

const Connected = connector(AddRemoveSaveSetModal);

export default withApi(Connected);
