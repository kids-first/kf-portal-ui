import * as React from 'react';
import { Button, Form, Input, Modal, notification } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { LoggedInUser, Sqon } from '../../../types';
import { Store } from 'antd/lib/form/interface';
// @ts-ignore
import saveSet from '@kfarranger/components/dist/utils/saveSet';
import graphql from 'services/arranger';

export const MAX_LENGTH_NAME = 50;
const REGEX_FOR_INPUT = /^[a-zA-Z0-9-_]*$/;
const FORM_NAME = 'save-set';

interface Props {
  hideModalCb: Function;
  api: Function;
  sqon: Sqon;
  user: LoggedInUser;
}

interface State {
  isVisible: boolean;
  confirmLoading: boolean;
  hasError: boolean;
}

type NameSetValidator = {
  msg: string;
  err: boolean;
};

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

export default class SaveSetModal extends React.Component<Props, State> {
  state: State = {
    isVisible: true,
    confirmLoading: false,
    hasError: false,
  };

  formRef = React.createRef<FormInstance>();

  createSaveSet = async (tag: string) =>
    await saveSet({
      type: 'participant',
      path: 'kf_id',
      api: graphql(this.props.api),
      sqon: this.props.sqon || {},
      userId: this.props.user.egoId,
      tag,
    });

  onFinish = async (values: Store) => {
    this.setState({
      confirmLoading: true,
    });
    const { nameSet } = values;
    try {
      await this.createSaveSet(nameSet);
      notification.success({
        message: 'Success',
        description: `Your participant set has been saved.`,
        duration: 10,
      });
    } catch (e) {
      notification.error({
        message: 'Error',
        description: 'We were unable to save your participant set. Please try again.',
        duration: 10,
      });
    } finally {
      this.setState({
        isVisible: false,
        confirmLoading: false,
      });
      this.props.hideModalCb();
    }
  };

  handleCancel = () => {
    this.setState({
      isVisible: false,
    });
    this.props.hideModalCb();
  };

  isSaveButtonDisabled = () => this.state.hasError || !this.formRef.current; //Input not touched

  render() {
    const { isVisible, confirmLoading } = this.state;
    // Display one extra character than allowed max in order to show an error message by the validator.
    const maxNumOfCharsToDisplay = MAX_LENGTH_NAME + 1;
    return (
      <Modal
        title="Save Participant Set"
        visible={isVisible}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Form.Item key={'submit'} noStyle>
            <Button
              form={FORM_NAME}
              htmlType="submit"
              key="save"
              type="primary"
              disabled={this.isSaveButtonDisabled()}
              loading={confirmLoading}
            >
              Save
            </Button>
          </Form.Item>,
        ]}
      >
        <Form name={FORM_NAME} ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item
            label="Name"
            name="nameSet"
            hasFeedback
            rules={[
              () => ({
                validator: (_, value): Promise<any> => {
                  const { msg, err } = validateNameSetInput(value);
                  this.setState({ hasError: err });
                  if (err) {
                    return Promise.reject(msg);
                  }
                  return Promise.resolve(msg);
                },
              }),
            ]}
          >
            <Input
              maxLength={maxNumOfCharsToDisplay}
              placeholder="Enter the name of your new set"
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
