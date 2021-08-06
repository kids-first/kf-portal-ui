import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { withApi } from 'services/api';

import useUser from '../../hooks/useUser';
import { deleteAccount } from '../../store/actionCreators/user';

import './style.css';

const { Text } = Typography;

function DeleteAccount(props) {
  const dispatch = useDispatch();

  const { user } = useUser();

  const { api } = props;

  return (
    <Card className={'card'}>
      <Row type={'flex'} align={'middle'}>
        <Col span={20}>
          <Text strong>Delete Account</Text>
        </Col>
        <Col span={4}>
          <Button
            shape={'round'}
            type={'danger'}
            onClick={async () => {
              dispatch(deleteAccount(api, user));
            }}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

DeleteAccount.propTypes = {
  api: PropTypes.func.isRequired,
};

export default compose(withApi)(DeleteAccount);
