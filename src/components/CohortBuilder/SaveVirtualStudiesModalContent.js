import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';
import { injectState } from 'freactal';

import Input from 'uikit/Input';
import TextArea from 'uikit/TextArea';
import PromptMessage from 'uikit/PromptMessage';
import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';

import { saveVirtualStudy } from '../../store/actionCreators/virtualStudies';
import { createVirtualStudy } from 'services/virtualStudies';

const DESCRIPTION_MAX_LENGTH = 300;

class SaveVirtualStudiesModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.saving = false;
    this.state = {
      name: props.name || '',
      description: props.description || '',
      errorMessage: null,
    };

    autobind(this);
  }

  static propTypes = {
    saveAs: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    this.saving = false;
  }

  onDataChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  saveStudy() {
    const { name, description } = this.state;
    const {
      loggedInUser,
      sqons,
      activeSqonIndex,
      virtualStudyId,
      saveVirtualStudy,
      saveAs,
    } = this.props;

    const study = createVirtualStudy(
      saveAs ? null : virtualStudyId,
      name,
      description,
      sqons,
      activeSqonIndex,
    );

    return saveVirtualStudy(loggedInUser, study);
  }

  submitHandler() {
    // prevent the user from bash clicking
    if (this.saving) return;
    this.saving = true;

    this.setState({ errorMessage: null });

    return this.saveStudy()
      .then(() => {
        this.setState({ errorMessage: null });
        this.props.effects.unsetModal();
      })
      .catch(err => {
        this.saving = false;
        this.setState({ errorMessage: err.message });
      });
  }

  render() {
    const { name, description, errorMessage } = this.state;
    const submitDisabled = (name && name.length < 1) || this.saving;

    return (
      <div
        className="virtual-studies-save-modal"
        onKeyDown={event => {
          if (event.key === 'Escape') {
            this.props.effects.unsetModal();
          }
        }}
      >
        {errorMessage && <PromptMessage heading={'Error'} content={errorMessage} error />}
        <ModalContentSection>
          <label required>Name:</label>
          <Input value={name} name="name" onChange={this.onDataChange} maxlength="60" autoFocus />
          <br />
          <br />
          <strong>{`Description (${DESCRIPTION_MAX_LENGTH} characters max): `}</strong>
          <TextArea
            value={description}
            name="description"
            className="save-modal-container"
            onChange={this.onDataChange}
            maxlength={DESCRIPTION_MAX_LENGTH}
          />
        </ModalContentSection>
        <ModalFooter
          handleSubmit={this.submitHandler}
          submitText={'Save'}
          submitDisabled={submitDisabled}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentVirtualStudy } = state;
  return {
    uid: state.user.uid,
    loggedInUser: state.user.loggedInUser,
    sqons: currentVirtualStudy.sqons,
    activeSqonIndex: currentVirtualStudy.activeIndex,
    virtualStudyId: currentVirtualStudy.virtualStudyId,
    name: currentVirtualStudy.name,
    description: currentVirtualStudy.description,
  };
};

const mapDispatchToProps = {
  saveVirtualStudy,
};

export default compose(
  injectState,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SaveVirtualStudiesModalContent);
