import React from 'react';
import { compose, withState, withHandlers, defaultProps, withPropsOnChange } from 'recompose';
import { trim } from 'lodash';
import { withTheme } from 'emotion-theming';
import PencilIcon from 'react-icons/lib/fa/pencil';

import { input } from '../theme/tempTheme.module.css';

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
                className={input}
                style={{ width: '85%' }}
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
                style={{
                  width: '100%',
                  minHeight: '144px',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  resize: 'none',
                  border: 'solid 1px #cacbcf',
                  fontSize: '14px',
                }}
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
              <button onClick={handleCancel}>Cancel</button>
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
          style={{ cursor: 'text' }}
        >
          <span
            style={{
              whiteSpace: 'pre-line',
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '14px',
              lineHeight: '26px',
              color: '#343434',
            }}
          >
            {trim(inputValue)
              ? renderNonEditing
                ? renderNonEditing(trim(inputValue))
                : trim(inputValue)
              : placeholderComponent}
          </span>
          {!disabled && <PencilIcon style={{ paddingLeft: '10px' }} />}
        </div>
      )}
    </div>
  ),
);
