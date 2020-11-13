/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import UserSetsFrom from '../UserSetsForm';
import { Store } from 'antd/lib/form/interface';
import { Sqon } from 'store/sqon';
import { RootState } from 'store/rootState';
import { DispatchSaveSets } from 'store/saveSetTypes';
import { addSetToCurrentQuery } from 'store/actionCreators/saveSets';
import { connect, ConnectedProps } from 'react-redux';
import { closeModal, DispatchModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';

const ADD_SET_TO_QUERY_MODAL_ID = 'ADD_SET_TO_QUERY_MODAL_ID';
const FORM_NAME = 'add_user_set_to_query';

type OwnProps = {
  sqon: Sqon;
  visible: boolean;
};

const mapStateToProps = (state: RootState) => ({
  openModalId: selectModalId(state),
});

const mapDispatch = (dispatch: DispatchSaveSets & DispatchModal) => ({
  addSetToCurrentQuery: (setId: string) => dispatch(addSetToCurrentQuery(setId)),
  closeModal: (id: string) => dispatch(closeModal(id)),
});

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const ModalSetsToQuery: FunctionComponent<Props> = ({
  openModalId,
  closeModal,
  addSetToCurrentQuery,
}) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [form] = Form.useForm();

  const onCancel = () => closeModal(ADD_SET_TO_QUERY_MODAL_ID);

  const onFinish = async (values: Store) => {
    const { setId } = values;
    if (!setId) {
      return onCancel();
    }
    addSetToCurrentQuery(setId);
    onCancel();
  };

  const onChangeSelect = (value: any) => {
    if (value) {
      setIsSubmitDisabled(false);
    }
  };

  return (
    <Modal
      title={'Add a saved set to your query'}
      visible={openModalId === ADD_SET_TO_QUERY_MODAL_ID}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Form.Item key={'submit'} noStyle>
          <Button
            id="add_set_to_query"
            form={FORM_NAME}
            htmlType="submit"
            key="add_set_to_query"
            type="primary"
            disabled={isSubmitDisabled}
          >
            Add to query
          </Button>
        </Form.Item>,
      ]}
    >
      <UserSetsFrom
        onSelectChangeCb={onChangeSelect}
        form={form}
        formName={FORM_NAME}
        onFinish={onFinish}
      />
    </Modal>
  );
};

export default connector(ModalSetsToQuery);
