import React, { Component } from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';
import { deleteAccount } from 'components/loginButtons/deleteHandlers';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withRouter } from 'react-router';
import { withApi } from 'services/api';
import PropTypes from 'prop-types';
import './style.css';

const { Text } = Typography;

class DeleteAccount extends Component {
  static propTypes = {
    api: PropTypes.func.isRequired,
    state: PropTypes.shape({
      loggedInUser: PropTypes.object.isRequired,
    }).isRequired,
    effects: PropTypes.shape({
      setToken: PropTypes.func.isRequired,
      setUser: PropTypes.func.isRequired,
      clearIntegrationTokens: PropTypes.func.isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,
  };

  onClickDeleteAccount = async () => {
    const {
      api,
      state: { loggedInUser },
      effects: { setToken, setUser, clearIntegrationTokens },
      history,
    } = this.props;
    await deleteAccount({ api, loggedInUser, setToken, setUser, clearIntegrationTokens, history });
  };

  render() {
    return (
      <Card className={'card'}>
        <Row type={'flex'} align={'middle'}>
          <Col span={20}>
            <Text strong>Delete Account</Text>
          </Col>
          <Col span={4}>
            <Button shape={'round'} type={'danger'} onClick={this.onClickDeleteAccount}>
              Delete
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default compose(injectState, withRouter, withApi)(DeleteAccount);
