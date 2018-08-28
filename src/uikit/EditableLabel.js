// @flow
// TODO: move this to arranger/components
import React from 'react';
import { compose, withState, withHandlers, defaultProps, withPropsOnChange } from 'recompose';
import { trim } from 'lodash';
import { Trans } from 'react-i18next';

import { withTheme } from 'emotion-theming';

import PencilIcon from 'react-icons/lib/fa/pencil';
import { BioCopy } from '../components/UserProfile/ui';

export default compose(
  withTheme,
  withState('editing', 'setIsEditing', ({ isEditing }) => isEditing || false),
  withState('originalValue', 'setOriginalValue', ({ value }) => value),
  withState('inputValue', 'setInputValue', ({ value }) => value || ''),
  defaultProps({
    handleSave: value => console.log(value),
  }),
  withPropsOnChange(['isEditing'], ({ setIsEditing, isEditing }) => setIsEditing(isEditing)),
  withPropsOnChange(['value'], ({ setInputValue, value, setOriginalValue }) => {
    setOriginalValue(value);
    setInputValue(value);
  }),
  withHandlers({
    handleCancel: ({ originalValue, setIsEditing, setInputValue }) => () => {
      setIsEditing(false);
      setInputValue(originalValue || '');
    },
  }),
  withHandlers({
    toggleEditingAndSave: ({
      editing,
      setIsEditing,
      inputValue,
      handleSave,
      handleCancel,
      onChange,
      required,
    }) => e => {
      setIsEditing(!editing);
      if (!required || (required && inputValue.length !== 0)) {
        handleSave(inputValue);
      }
    },
  }),
)(
  ({
    theme,
    key,
    name,
    editing,
    autoFocus,
    required = false,
    toggleEditingAndSave,
    type = 'input',
    inputValue,
    setInputValue,
    setIsEditing,
    handleCancel,
    onChange = e => {},
    options = [],
    disabled = false,
    renderButtons,
    renderNonEditing,
    placeholderComponent,
    saveOnKeyDown = true,
    ...props
  }) => (
    <div key={key}>
      {editing ? (
        <div style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {options.length === 0 &&
            (type === 'input' ? (
              <input
                css={`
                  ${theme.input};
                  width: 85%;
                `}
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  onChange(e);
                }}
                onKeyDown={e => {
                  if (saveOnKeyDown) {
                    if (e.key === 'Enter') {
                      toggleEditingAndSave(e);
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }
                }}
                type="text"
                onFocus={e => e.target.select()}
                name={name}
                autoFocus={autoFocus}
              />
            ) : (
              <textarea
                autoFocus={autoFocus}
                css={`
                  width: 100%;
                  min-height: 144px;
                  border-radius: 10px;
                  transition: all 0.2s ease;
                  resize: none;
                  border: solid 1px #cacbcf;
                  font-size: 14px;
                `}
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  onChange(e);
                }}
                onKeyDown={e => {
                  if (saveOnKeyDown) {
                    if (e.key === 'Enter') {
                      toggleEditingAndSave(e);
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }
                }}
                type="text"
                onFocus={e => e.target.select()}
                name={name}
              />
            ))}
          {options.length > 0 && (
            <select
              component="select"
              name="roles"
              onChange={e => {
                setInputValue(e.target.value);
                onChange(e);
              }}
            >
              <option value="" disabled={true}>
                Select...
              </option>
              {options.map(role => (
                <option value={role} key={role} selected={role === inputValue ? 'selected' : ''}>
                  {role}
                </option>
              ))}
            </select>
          )}
          {!renderButtons && (
            <span>
              <button
                onClick={e => toggleEditingAndSave(e)}
                disabled={required && inputValue.length === 0}
              >
                Save
              </button>
              <button onClick={handleCancel}>
                <Trans>Cancel</Trans>
              </button>
            </span>
          )}
          {renderButtons &&
            renderButtons({
              handleSave: e => toggleEditingAndSave(e),
              handleCancel,
              saveDisabled: required && inputValue.length === 0,
            })}
        </div>
      ) : (
        <div
          onClick={disabled ? () => {} : e => toggleEditingAndSave(e)}
          style={{
            cursor: 'text',
          }}
        >
          <BioCopy
            css={`
              white-space: pre-line;
            `}
          >
            {trim(inputValue)
              ? renderNonEditing ? renderNonEditing(trim(inputValue)) : trim(inputValue)
              : placeholderComponent}
          </BioCopy>
          {!disabled && <PencilIcon style={{ paddingLeft: '10px' }} />}
        </div>
      )}
    </div>
  ),
);
