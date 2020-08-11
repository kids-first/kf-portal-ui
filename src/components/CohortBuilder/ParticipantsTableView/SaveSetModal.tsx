/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, notification } from 'antd';
import { LoggedInUser } from 'store/user';
import { Sqon } from 'store/sqon';
import { Store } from 'antd/lib/form/interface';
import { connect, ConnectedProps } from 'react-redux';
import {
  DispatchSaveSets,
  isSaveSetNameConflictError,
  SaveSetParams,
  SaveSetState,
} from 'store/saveSetTypes';
import { createSaveSetIfUnique, reInitializeSaveSetsState } from 'store/actionCreators/saveSets';
import { selectError, selectIsLoading } from 'store/selectors/saveSetsSelectors';
import { RootState } from 'store/rootState';

export const MAX_LENGTH_NAME = 50;
const REGEX_FOR_INPUT = /^[a-zA-Z0-9-_]*$/;
const FORM_NAME = 'save-set';

type OwnProps = {
  hideModalCb: Function;
  api: Function;
  sqon: Sqon;
  user: LoggedInUser;
};

type NameSetValidator = {
  msg: string;
  err: boolean;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: selectIsLoading(state),
    error: selectError(state),
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onCreateSet: (params: SaveSetParams) => dispatch(createSaveSetIfUnique(params)),
  reInitializeState: () => dispatch(reInitializeSaveSetsState()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

export const validateNameSetInput = (value: string): NameSetValidator => {
  if (!value) {
    return { msg: 'Please input the name of your set', err: true };
  } else if (value.length > MAX_LENGTH_NAME) {
    return { msg: `Name is too long (max ${MAX_LENGTH_NAME} characters)`, err: true };
  } else if (!REGEX_FOR_INPUT.test(value)) {
    return { msg: 'Invalid character(s) were detected', err: true };
  }
  return { msg: '', err: false };
};

const SaveSetModal: FunctionComponent<Props> = (props) => {
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { user, sqon, api, onCreateSet, create, reInitializeState, hideModalCb } = props;

  const onSuccessCb = () => {
    notification.success({
      message: 'Success',
      description: `Your participant set has been saved.`,
      duration: 10,
    });
    setIsVisible(false);
    hideModalCb();
  };

  const onNameConflictCb = () => {
    setHasError(true);
  };

  const onFinish = async (values: Store) => {
    const { nameSet } = values;

    await onCreateSet({
      tag: nameSet,
      userId: user.egoId,
      api: api,
      sqon: sqon,
      onSuccess: onSuccessCb,
      onNameConflict: onNameConflictCb,
    });
  };

  const handleCancel = () => {
    reInitializeState();
    setIsVisible(false);
    hideModalCb();
  };

  const { isLoading, error } = create;
  const isSaveButtonDisabled = () => error != null;
  // Display one extra character than allowed max in order to show an error message by the validator.
  const maxNumOfCharsToDisplay = MAX_LENGTH_NAME + 1;

  useEffect(() => {
    if (error && !isSaveSetNameConflictError(error)) {
      notification.error({
        message: 'Error',
        description: 'We were unable to save your participant set. Please try again.',
        duration: 10,
      });
    }
  }, [error]);

  return (
    <Modal
      title="Save Participant Set"
      visible={isVisible}
      confirmLoading={isLoading}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Form.Item key={'submit'} noStyle>
          <Button
            id="CreateSaveSets"
            form={FORM_NAME}
            htmlType="submit"
            key="save"
            type="primary"
            disabled={isSaveButtonDisabled()}
            loading={isLoading}
          >
            Save
          </Button>
        </Form.Item>,
      ]}
    >
      <Form
        form={form}
        name={FORM_NAME}
        initialValues={{ nameSet: 'Save_Set_1' }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="nameSet"
          hasFeedback
          validateStatus={hasError ? 'error' : 'success'}
          help={error ? error.message : 'Letters, numbers, hyphens (-), and underscores (_)'}
          rules={[
            () => ({
              validator: (_, value) => {
                if (hasError) {
                  reInitializeState();
                }
                const { msg, err } = validateNameSetInput(value);
                setHasError(err);
                if (err) {
                  Promise.reject(msg);
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            autoFocus
            maxLength={maxNumOfCharsToDisplay}
            placeholder="Enter the name of your new set"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Connected = connector(SaveSetModal);

export default Connected;
