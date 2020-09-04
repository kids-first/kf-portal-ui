/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { Sqon } from 'store/sqon';
import { Store } from 'antd/lib/form/interface';
import { selectUserSaveSets } from 'store/selectors/saveSetsSelectors';
import { RootState } from 'store/rootState';
import { DispatchSaveSets, SaveSetState } from 'store/saveSetTypes';
import { connect, ConnectedProps } from 'react-redux';
import { editSaveSet } from 'store/actionCreators/saveSets';
import { SaveSetInfo } from '../../UserDashboard/ParticipantSets';
import participantIcon from '../../../assets/icon-participants.svg';
import './AddRemoveSaveSetModal.css';

const FORM_NAME = 'add-remove-set';

type OwnProps = {
  hideModalCb: Function;
  api: Function;
  sqon: Sqon;
  actionType: string;
};

export type AddRemoveSetParams = {
  saveSetInfo: SaveSetInfo;
  onSuccess: Function;
  onFail: Function;
  onNameConflict: Function;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: selectUserSaveSets(state),
    isLoading: false,
    error: null,
    isDeleting: false,
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  // onCreateSet: (params: SaveSetParams) => dispatch(createSaveSetIfUnique(params)),
  onEditSet: (params: AddRemoveSetParams) => dispatch(editSaveSet(params)), //TODO add new stuff
  // reInitializeState: () => dispatch(reInitializeSaveSetsState()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const actionTypes = {
  ADD: 'add',
  REMOVE: 'remove',
};

const finishButtonText = (type: string) => {
  switch (type) {
    case actionTypes.ADD:
      return 'Add to set';
    case actionTypes.REMOVE:
      return 'Remove from set';
    default:
      break;
  }
};

const formTitle = (type: string) => {
  switch (type) {
    case actionTypes.ADD:
      return 'Add to a participant set';
    case actionTypes.REMOVE:
      return 'Remove from a participant set';
    default:
      break;
  }
};

const AddRemoveSaveSetModal: FunctionComponent<Props> = (props) => {
  const [form] = Form.useForm();

  const { hideModalCb, actionType, userSets } = props;
  const [isVisible, setIsVisible] = useState(true);

  const onFinish = async (values: Store) => {
    const { nameSet } = values;
    switch (actionType) {
      case actionTypes.ADD:
        break;
      case actionTypes.REMOVE:
        break;
      default:
        break;
    }

    console.error(nameSet); //TODO remove
    setIsVisible(false);
    hideModalCb();
  };

  const onCancel = () => {
    // reInitializeState();
    setIsVisible(false);
    hideModalCb();
  };

  return (
    <Modal
      title={formTitle(actionType)}
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Form.Item key={'submit'} noStyle>
          <Button
            id="CreateSaveSets"
            form={FORM_NAME}
            htmlType="submit"
            key="save"
            type="primary"
            disabled={false}
            loading={false}
          >
            {finishButtonText(actionType)}
          </Button>
        </Form.Item>,
      ]}
    >
      <Form form={form} name={FORM_NAME} onFinish={onFinish} layout="vertical">
        <Form.Item label="Participant Set" name="nameSet" hasFeedback>
          <Select placeholder="Choose a set">
            {userSets.sets.map((s) => (
              <Select.Option key={s.setId} value={s.tag}>
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
    </Modal>
  );
};

const Connected = connector(AddRemoveSaveSetModal);

export default Connected;
