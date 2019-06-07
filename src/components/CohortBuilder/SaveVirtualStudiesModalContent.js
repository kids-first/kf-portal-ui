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

  propTypes = {
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

    return saveVirtualStudy({
      loggedInUser,
      sqonsState: {
        sqons,
        activeIndex: activeSqonIndex,
        virtualStudyId: saveAs ? null : virtualStudyId,
      },
      name,
      description,
    });
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
      <div className="virtual-studies-save-modal">
        {errorMessage && <PromptMessage heading={'Error'} content={errorMessage} error />}
        <ModalContentSection>
          You are saving this page of results with the current configuration of queries.
        </ModalContentSection>
        <ModalContentSection>
          <label required>Virtual Study name:</label>
          <Input value={name} name="name" onChange={this.onDataChange} maxlength="60" />

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

const mapStateToProps = state => ({
  uid: state.user.uid,
  loggedInUser: state.user.loggedInUser,
  sqons: state.cohortBuilder.sqons,
  activeSqonIndex: state.cohortBuilder.activeIndex,
  virtualStudyId: state.cohortBuilder.virtualStudyId,
  name: state.cohortBuilder.name,
  description: state.cohortBuilder.description,
});

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
