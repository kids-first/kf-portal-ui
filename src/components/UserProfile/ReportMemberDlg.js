import React from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, Button, message } from 'antd';
import { reportMember } from '../../services/members/reportMember';

const { TextArea } = Input;

const hasNoMotive = raw => !raw || !raw.trim();

export default class ReportMemberDlg extends React.Component {
  state = {
    isLoading: false,
    motiveText: '',
    error: null,
  };

  static propTypes = {
    onClickCancelCB: PropTypes.func.isRequired,
    onClickOkCB: PropTypes.func.isRequired,
    userReportingId: PropTypes.string.isRequired,
    userBlamedId: PropTypes.string.isRequired,
  };

  handleOk = async () => {
    const { userReportingId, userBlamedId, onClickOkCB } = this.props;
    const { motiveText } = this.state;

    this.setState({
      isLoading: true,
    });

    try {
      await reportMember({
        userReportingId,
        userBlamedId,
        blameDescription: motiveText,
      });
      message.success('The member was reported');
    } catch (e) {
      message.error('An error occurred. The member could not be reported.');
    } finally {
      this.setState({
        visible: false,
        isLoading: false,
      });
      onClickOkCB();
    }
  };

  handleCancel = () => {
    const { onClickCancelCB } = this.props;
    this.setState({
      visible: false,
    });
    onClickCancelCB();
  };

  onChange = e => {
    this.setState({
      motiveText: e.target.value,
    });
  };

  render() {
    const { isLoading, motiveText } = this.state;
    return (
      <Modal
        centered
        title="Report Member for inappropriate content"
        visible={true}
        onOk={this.handleOk}
        width={720}
        confirmLoading={isLoading}
        closable={false}
        onCancel={this.handleCancel}
        footer={[
          <Button
            key="cancel"
            size={'small'}
            shape="round"
            ghost
            style={{ color: 'rgb(144, 38, 142)' }}
            disabled={isLoading}
            onClick={this.handleCancel}
          >
            CANCEL
          </Button>,
          <Button
            key="submit"
            size={'small'}
            shape="round"
            disabled={hasNoMotive(motiveText)}
            style={
              hasNoMotive(motiveText)
                ? null
                : { backgroundColor: 'rgb(57, 69, 146)', color: 'white' }
            }
            loading={isLoading}
            onClick={this.handleOk}
          >
            SUBMIT
          </Button>,
        ]}
      >
        <p>
          Please indicate your motive for reporting this member. Our support team will evaluate your
          request and any action deemed necessary will be taken shortly
        </p>
        <TextArea
          rows={4}
          disabled={isLoading}
          placeholder={'Your message...'}
          onChange={this.onChange}
        />
      </Modal>
    );
  }
}
