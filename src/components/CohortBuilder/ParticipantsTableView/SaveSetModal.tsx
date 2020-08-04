import * as React from 'react';
import { Button, Form, Input, Modal, notification } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { LoggedInUser } from 'store/user';
import { Sqon } from 'store/sqon';
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
  hasSameName: boolean;
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
    hasSameName: false,
  };

  formRef = React.createRef<FormInstance>();

  onFinish = async (values: Store) => {
    this.setState({
      confirmLoading: true,
    });
    const { nameSet } = values;
    const { user, sqon, api } = this.props;

    const body = {
      query:
        'query($sqon: JSON) {' +
        'sets {aggregations(filters: $sqon, aggregations_filter_themselves: false) {size {stats {count}}}}' +
        '}',
      variables: {
        sqon: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'tag.keyword', value: [nameSet] },
            },
            {
              op: 'in',
              content: { field: 'userId', value: [user.egoId] },
            },
          ],
        },
      },
    };

    try {
      const { data } = await graphql()(body);

      if (data.data?.sets?.aggregations?.size?.stats?.count) {
        this.setState({
          hasSameName: true,
        });
      } else {
        await saveSet({
          type: 'participant',
          path: 'kf_id',
          sqon,
          userId: user.egoId,
          api: graphql(api),
          tag: nameSet,
        });
        notification.success({
          message: 'Success',
          description: `Your participant set has been saved.`,
          duration: 10,
        });
        this.setState({
          isVisible: false,
          confirmLoading: false,
          hasSameName: false,
        });
        this.props.hideModalCb();
      }
    } catch (e) {
      notification.error({
        message: 'Error',
        description: 'We were unable to save your participant set. Please try again.',
        duration: 10,
      });
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
    const { isVisible, confirmLoading, hasSameName } = this.state;
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
            validateStatus={hasSameName ? 'error' : 'success'}
            help={hasSameName ? 'A set with this name already exists' : ''}
            rules={[
              () => ({
                validator: (_, value): Promise<any> => {
                  const { msg, err } = validateNameSetInput(value);
                  this.setState({ hasError: err, hasSameName: false });
                  if (err) {
                    return Promise.reject(msg);
                  }
                  return Promise.resolve(msg);
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
  }
}
