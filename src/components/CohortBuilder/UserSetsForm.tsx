/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Col, Form, Row, Select } from 'antd';
import participantIcon from '../../assets/icon-participants.svg';
import { RootState } from 'store/rootState';
import { UserSet, UserSetsState } from 'store/saveSetTypes';
import { selectIsEditingSets, selectSets } from 'store/selectors/saveSetsSelectors';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from 'antd/lib/form/interface';

type SubState = {
  userSets: UserSetsState;
};

const mapState = (state: RootState): SubState => ({
  userSets: {
    sets: selectSets(state),
    isLoading: false,
    error: null,
    isDeleting: false,
    isEditing: selectIsEditingSets(state),
  },
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OwnProps = {
  formName: string;
  onFinish: (values: Store) => void;
};

type Props = OwnProps & PropsFromRedux;

const UserSetsForm: FunctionComponent<Props> = ({ formName, userSets, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} name={formName} onFinish={onFinish} layout="vertical">
      <Form.Item label="Participant Set" name="setId" hasFeedback>
        <Select placeholder="Choose a set">
          {userSets.sets.map((s: UserSet) => (
            <Select.Option key={s.setId} value={s.setId}>
              <Row>
                <Col style={{ paddingRight: 15 }}>{s.tag}</Col>
                <Col style={{ paddingRight: 2 }}>
                  <img style={{ width: 11 }} src={participantIcon} alt="Participants" />
                </Col>
                <Col>
                  <div className={'secondary-text-color'}>{s.size}</div>
                </Col>
              </Row>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

const Connected = connector(UserSetsForm);

export default Connected;
