/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Form, Input, Modal, notification, Spin } from 'antd';
import { Store } from 'antd/lib/form/interface';

import filtersToName, { SET_DEFAULT_NAME } from 'common/sqonToName';
import { withApi } from 'services/api';
import {
  createSetIfUnique,
  editSetTag,
  reInitializeSetsState,
} from 'store/actionCreators/saveSets';
import { Api, ApiFunction } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import {
  DispatchSaveSets,
  EditSetTagParams,
  isSaveSetNameConflictError,
  SaveSetActionsTypes,
  SaveSetParams,
  SaveSetState,
  UserSet,
} from 'store/saveSetTypes';
import { selectError, selectIsLoading, selectSets } from 'store/selectors/saveSetsSelectors';
import { Sqon } from 'store/sqon';
import { User } from 'store/userTypes';

export const MAX_LENGTH_NAME = 50;
const FORM_NAME = 'save-set';

type OwnProps = {
  title: string;
  saveSetActionType: SaveSetActionsTypes;
  hideModalCb: Function;
  sqon: Sqon;
  user: User;
  setToRename?: UserSet;
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
  userSets: {
    sets: selectSets(state),
    isLoading: false,
    error: null,
    isDeleting: false,
    isEditing: false,
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onCreateSet: (api: ApiFunction, params: SaveSetParams) =>
    dispatch(createSetIfUnique(api, params)),
  onEditSet: (api: ApiFunction, params: EditSetTagParams) => dispatch(editSetTag(api, params)),
  reInitializeState: () => dispatch(reInitializeSetsState()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps & Api;

export const extractTagNumbers = (userSets: [{ node: UserSet }]) => {
  const regExp = /saved_set_([0-9]+)/i;

  return userSets.reduce((acc: number[], s: { node: UserSet }) => {
    const match = s.node.tag.match(regExp);
    if (match && match.length > 0) {
      return [...acc, Number(match[1])];
    }
    return acc;
  }, []);
};

export const validateNameSetInput = (rawValue: string): NameSetValidator => {
  const value = (rawValue || '').trim();
  if (!value) {
    return { msg: 'Please input the name of your set', err: true };
  }
  return { msg: '', err: false };
};

const SaveSetModal: FunctionComponent<Props> = (props) => {
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasErrorMessage, setHasErrorMessage] = useState('');
  const [loadingDefaultTagName, setLoadingDefaultTagName] = useState(false);

  const {
    sqon,
    onCreateSet,
    onEditSet,
    create,
    reInitializeState,
    hideModalCb,
    title,
    saveSetActionType,
    setToRename,
    api,
  } = props;

  const onSuccessCreateCb = () => {
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

    switch (saveSetActionType) {
      case SaveSetActionsTypes.EDIT:
        if (!setToRename) {
          break;
        }

        await onEditSet(api, {
          setId: setToRename.setId,
          newTag: nameSet,
          onSuccess: () => {
            setIsVisible(false);
            hideModalCb();
          },
          onNameConflict: onNameConflictCb,
          onFail: () => {
            notification.error({
              message: 'Error',
              description: `Editing the name of this Saved Set has failed`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
        });
        break;
      case SaveSetActionsTypes.CREATE:
        await onCreateSet(api, {
          tag: nameSet,
          sqon: sqon,
          onSuccess: onSuccessCreateCb,
          onNameConflict: onNameConflictCb,
        });
        break;
      default:
        setIsVisible(false);
        hideModalCb();
        break;
    }
  };

  const handleCancel = () => {
    reInitializeState();
    setIsVisible(false);
    hideModalCb();
  };

  const { isLoading, error } = create;
  const isSaveButtonDisabled = () => error != null || hasError;
  // Display one extra character than allowed max in order to show an error message by the validator.
  const maxNumOfCharsToDisplay = MAX_LENGTH_NAME + 1;

  useEffect(() => {
    if (error && !isSaveSetNameConflictError(error)) {
      notification.error({
        message: 'Error',
        description: `We were unable to save your participant set: [${
          error.message || 'Unknown Error'
        }]`,
        duration: 10,
      });
    }
  }, [error]);

  useEffect(() => {
    const defaultName = filtersToName({ filters: sqon });
    setLoadingDefaultTagName(true);
    const formDefaultValue =
      saveSetActionType === SaveSetActionsTypes.CREATE
        ? { nameSet: defaultName !== SET_DEFAULT_NAME ? defaultName : '' }
        : { nameSet: setToRename?.tag ?? '' };
    form.setFieldsValue(formDefaultValue);
    setLoadingDefaultTagName(false);
  }, [form, saveSetActionType, setToRename, sqon]);

  const displayHelp = () => {
    if (error) {
      return error.message;
    } else if (hasError) {
      return hasErrorMessage;
    } else {
      return '';
    }
  };

  const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <Modal
      title={title}
      visible={isVisible}
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
      {SaveSetActionsTypes.CREATE === saveSetActionType && loadingDefaultTagName ? (
        <Spin size="small" tip="Loading..." />
      ) : (
        <Form form={form} name={FORM_NAME} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="nameSet"
            hasFeedback
            validateStatus={hasError ? 'error' : 'success'}
            help={displayHelp()}
            rules={[
              () => ({
                validator: (_, value) => {
                  if (error && isSaveSetNameConflictError(error)) {
                    reInitializeState();
                  }
                  const { msg, err } = validateNameSetInput(value);
                  setHasError(err);
                  setHasErrorMessage(msg);
                  if (err) {
                    return Promise.reject(msg);
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
              allowClear={true}
              onFocus={handleFocus}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

const Connected = connector(SaveSetModal);

export default withApi(Connected);
