import React from 'react';
import Component from 'react-component-component';
import Input from 'uikit/Input';
import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';
import PromptMessage from 'uikit/PromptMessage';

export default ({ onSubmit, submitDisabled }) => {
  const initialState = { name: '', errorMessage: null };
  const onDataChange = s => e => s.setState({ name: e.target.value });
  const submitHandler = s => () => {
    s.setState({ errorMessage: null });
    return onSubmit({ studyName: s.state.name }).catch(err => {
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
            You are saving this page of results with the current configuration of queries.
          </ModalContentSection>
          <ModalContentSection>
            <strong>Virtual Study name: *</strong>
            <span>
              <Input value={s.state.name} onChange={onDataChange(s)} />
            </span>
          </ModalContentSection>
          <ModalFooter
            handleSubmit={submitHandler(s)}
            submitText={'Save'}
            submitDisabled={submitDisabled}
          />
        </React.Fragment>
      )}
    </Component>
  );
};
