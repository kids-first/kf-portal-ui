import React, { Component } from 'react';
import { Card, Button } from 'antd';
import PropTypes from 'prop-types';

class ContactEditForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onClickCancelCb: PropTypes.func.isRequired,
    onClickSaveCb: PropTypes.func.isRequired,
  };

  state = {};

  render() {
    const { data, onClickCancelCb, onClickSaveCb } = this.props;
    return (
      <Card
        title="Contact Information"
        extra={
          <div>
            <Button type="primary" shape="round" onClick={onClickCancelCb}>
              Cancel
            </Button>
            <Button type="primary" shape="round" onClick={onClickSaveCb}>
              Save
            </Button>
          </div>
        }
      >
        <p>TODO</p>
      </Card>
    );
  }
}

export default ContactEditForm;
