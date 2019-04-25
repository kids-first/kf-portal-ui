import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';

import Input from 'uikit/Input';
import PromptMessage from 'uikit/PromptMessage';
import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';

export default class SaveVirtualStudiesModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.saving = false;
    autobind(this);
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

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

  submitHandler() {
    // prevent the user from bash clicking
    if (this.saving) return;
    this.saving = true;

    this.setState({ errorMessage: null });

    return this.props
      .onSubmit(this.state.name)
      .then(() => {
        this.setState({ errorMessage: null });
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
            <Input value={name} onChange={this.onDataChange} />
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
