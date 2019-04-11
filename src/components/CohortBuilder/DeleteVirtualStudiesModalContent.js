import React from 'react';
import Component from 'react-component-component';
import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';
import PromptMessage from 'uikit/PromptMessage';

export default ({ onSubmit, submitDisabled }) => {
  const initialState = { errorMessage: null };
  const submitHandler = s => () => {
    s.setState({ errorMessage: null });
    return onSubmit().catch(err => {
      s.setState({ errorMessage: err.message });
    });
  };
  return (
    <Component initialState={initialState}>
      {s => (
        <React.Fragment>
          {s.state.errorMessage && (
            <PromptMessage heading={'Error'} content={s.state.errorMessage} error />
          )}
          <ModalContentSection>
            Are you sure you want to delete this Virtual Study?
          </ModalContentSection>
          <ModalFooter
            handleSubmit={submitHandler(s)}
            submitText={'Delete'}
            submitDisabled={submitDisabled}
          />
        </React.Fragment>
      )}
    </Component>
  );
};
