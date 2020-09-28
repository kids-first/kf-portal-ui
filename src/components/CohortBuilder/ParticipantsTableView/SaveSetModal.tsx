/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, notification, Spin } from 'antd';
import { LoggedInUser } from 'store/userTypes';
import { Sqon } from 'store/sqon';
import { Store } from 'antd/lib/form/interface';
import { connect, ConnectedProps } from 'react-redux';
import {
  DispatchSaveSets,
  EditSetTagParams,
  isSaveSetNameConflictError,
  SaveSetActionsTypes,
  SaveSetParams,
  SaveSetState,
  UserSet,
} from 'store/saveSetTypes';
import {
  createSetIfUnique,
  editSetTag,
  reInitializeSetsState,
} from 'store/actionCreators/saveSets';
import { selectError, selectIsLoading, selectSets } from 'store/selectors/saveSetsSelectors';
import { RootState } from 'store/rootState';
import { getSetAndParticipantsCountByUser } from 'services/sets';
import { SetInfo } from '../../UserDashboard/ParticipantSets';

export const MAX_LENGTH_NAME = 50;
const REGEX_FOR_INPUT = /^[a-zA-Z0-9-_ ]*$/;
const FORM_NAME = 'save-set';

type OwnProps = {
  title: string;
  saveSetActionType: SaveSetActionsTypes;
  hideModalCb: Function;
  sqon: Sqon;
  user: LoggedInUser;
  setToRename?: SetInfo;
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
  onCreateSet: (params: SaveSetParams) => dispatch(createSetIfUnique(params)),
  onEditSet: (params: EditSetTagParams) => dispatch(editSetTag(params)),
  reInitializeState: () => dispatch(reInitializeSetsState()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

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
  const [hasErrorMessage, setHasErrorMessage] = useState('');
  const [defaultTagName, setDefaultTagName] = useState('Saved_Set_1');
  const [loadingDefaultTagName, setLoadingDefaultTagName] = useState(false);

  const {
    user,
    sqon,
    onCreateSet,
    onEditSet,
    create,
    reInitializeState,
    hideModalCb,
    title,
    saveSetActionType,
    setToRename,
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

        await onEditSet({
          setInfo: {
            key: setToRename.key,
            name: nameSet,
            currentUser: user.egoId,
          } as SetInfo,
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
        await onCreateSet({
          tag: nameSet,
          userId: user.egoId,
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
    const generateSetDefaultName = async () => {
      try {
        setLoadingDefaultTagName(true);

        const userSets = await getSetAndParticipantsCountByUser(user.egoId);
        const tagNameSuffixes = extractTagNumbers(userSets);

        if (tagNameSuffixes.length > 0) {
          setDefaultTagName(`Saved_Set_${Math.max(...tagNameSuffixes) + 1}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDefaultTagName(false);
      }
    };
    generateSetDefaultName().then();
  }, [user.egoId]);

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
        <Form
          form={form}
          name={FORM_NAME}
          initialValues={
            saveSetActionType === SaveSetActionsTypes.CREATE
              ? { nameSet: defaultTagName }
              : { nameSet: setToRename?.name || '' }
          }
          onFinish={onFinish}
        >
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

export default Connected;
