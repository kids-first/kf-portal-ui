import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Modal } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { createVirtualStudy } from 'services/virtualStudies';
import { saveVirtualStudy } from 'store/actionCreators/virtualStudies';
import PromptMessage from 'uikit/PromptMessage';

import { selectUser } from '../../store/selectors/users';

const { TextArea } = Input;

const DESCRIPTION_MAX_LENGTH = 300;

class SaveVirtualStudiesModal extends React.Component {
  state = {
    isLoading: false,
    name: this.props.defaultVsName || '',
    description: this.props.defaultVsDescription || '',
    errorMessage: null,
  };

  static propTypes = {
    saveAs: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    defaultVsName: PropTypes.string,
    defaultVsDescription: PropTypes.string,
    user: PropTypes.object.isRequired,
    saveVirtualStudy: PropTypes.func.isRequired,
    onCloseCB: PropTypes.func.isRequired,
    sqons: PropTypes.array,
    virtualStudyId: PropTypes.string,
    activeSqonIndex: PropTypes.number.isRequired,
  };

  onChange = ({ target: { id, value } }) => {
    if (id === 'description') {
      return this.setState({ description: value });
    } else if (id === 'name') {
      return this.setState({ name: value });
    }
  };

  saveStudy = () => {
    const { name, description } = this.state;
    const { user, sqons, activeSqonIndex, virtualStudyId, saveVirtualStudy, saveAs } = this.props;

    const study = createVirtualStudy(
      saveAs ? null : virtualStudyId,
      name,
      description,
      sqons,
      activeSqonIndex,
    );

    return saveVirtualStudy(user, study);
  };

  submitHandler = async () => {
    this.setState({ errorMessage: null, isLoading: true });

    try {
      await this.saveStudy();
      this.props.onCloseCB();
    } catch (err) {
      this.setState({ errorMessage: err.message, isLoading: false });
    }
  };

  render() {
    const { title, onCloseCB } = this.props;
    const { name, description, errorMessage, isLoading } = this.state;
    const submitDisabled = (name && name.length < 1) || isLoading;

    return (
      <Modal
        visible
        title={title}
        onCancel={onCloseCB}
        footer={[
          <Button key="cancel" onClick={onCloseCB}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            disabled={submitDisabled}
            loading={isLoading}
            onClick={this.submitHandler}
          >
            Save
          </Button>,
        ]}
      >
        <div className="virtual-studies-save-modal">
          {errorMessage && <PromptMessage heading={'Error'} content={errorMessage} error />}
          <div className="cb-modalContentSection">
            <label className="required">Name:</label>
            <Input value={name} id="name" onChange={this.onChange} maxLength={60} autoFocus />
            <br />
            <br />
            <strong>{`Description (${DESCRIPTION_MAX_LENGTH} characters max): `}</strong>
            <TextArea
              value={description}
              onChange={this.onChange}
              id={'description'}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentVirtualStudy } = state;
  return {
    sqons: currentVirtualStudy.sqons,
    activeSqonIndex: currentVirtualStudy.activeIndex,
    virtualStudyId: currentVirtualStudy.virtualStudyId,
    defaultVsName: currentVirtualStudy.name,
    defaultVsDescription: currentVirtualStudy.description,
    user: selectUser(state),
  };
};

const mapDispatchToProps = {
  saveVirtualStudy,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(SaveVirtualStudiesModal);
