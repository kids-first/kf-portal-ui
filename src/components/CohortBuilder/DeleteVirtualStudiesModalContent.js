import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';

import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';
import PromptMessage from 'uikit/PromptMessage';

export default class DeleteVirtualStudiesModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.deleting = false;
    autobind(this);
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  };

  state = {
    errorMessage: null,
  };

  componentWillMount() {
    this.deleting = false;
  }

  submitHandler() {
    // prevent the user from bash clicking
    if (this.deleting) return;
    this.deleting = true;

    this.setState({ errorMessage: null });

    return this.props
      .onSubmit()
      .then(() => {
        this.setState({ errorMessage: null });
      })
      .catch(err => {
        this.deleting = false;
        this.setState({ errorMessage: err.message });
      });
  }

  render() {
    const { name } = this.props;
    const { errorMessage } = this.state;

    return (
      <React.Fragment>
        {errorMessage && <PromptMessage heading={'Error'} content={errorMessage} error />}
        <ModalContentSection>
          Are you sure you want to delete "{name}"?
          <br />
          <br />
          This action cannot be undone.
        </ModalContentSection>
        <ModalFooter
          handleSubmit={this.submitHandler}
          submitText={'Delete'}
          submitDisabled={this.deleting}
        />
      </React.Fragment>
    );
  }
}
