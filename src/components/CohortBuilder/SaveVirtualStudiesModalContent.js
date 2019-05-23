import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import autobind from 'auto-bind-es5';
import { injectState } from 'freactal';

import Input from 'uikit/Input';
import PromptMessage from 'uikit/PromptMessage';
import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';

import { saveVirtualStudy } from '../../store/actionCreators/virtualStudies';

class SaveVirtualStudiesModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.saving = false;
    autobind(this);
  }

  state = {
    name: '',
    errorMessage: null,
  };

  componentWillMount() {
    this.saving = false;
  }

  onDataChange(evt) {
    this.setState({ name: evt.target.value });
  }

  saveStudy() {
    const { name } = this.state;
    const { loggedInUser, sqons, activeSqonIndex, saveVirtualStudy } = this.props;

    return saveVirtualStudy({
      name,
      loggedInUser,
      sqonsState: {
        sqons,
        activeIndex: activeSqonIndex,
      },
      description: '',
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
    const { name, errorMessage } = this.state;
    const submitDisabled = (name && name.length < 1) || this.saving;

    return (
      <React.Fragment>
        {errorMessage && <PromptMessage heading={'Error'} content={errorMessage} error />}
        <ModalContentSection>
          You are saving this page of results with the current configuration of queries.
        </ModalContentSection>
        <ModalContentSection>
          <strong>Virtual Study name: *</strong>
          <span>
            <Input value={name} onChange={this.onDataChange} maxlength="60" />
          </span>
        </ModalContentSection>
        <ModalFooter
          handleSubmit={this.submitHandler}
          submitText={'Save'}
          submitDisabled={submitDisabled}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.user.uid,
  loggedInUser: state.user.loggedInUser,
  sqons: state.cohortBuilder.sqons,
  activeSqonIndex: state.cohortBuilder.activeIndex,
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
