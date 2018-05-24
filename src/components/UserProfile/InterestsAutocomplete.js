import React from 'react';
import { debounce, get, toLower } from 'lodash';
import { compose, withProps, withPropsOnChange, withState } from 'recompose';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import Downshift from 'downshift';
import { Trans } from 'react-i18next';

import { withApi } from 'services/api';
import { getTags } from 'services/profiles';

const dropdownLabelStyle = theme => css`
  text-transform: uppercase;
  font-size: 0.7rem;
  line-height: 0.8rem;
  color: ${theme.greyScale9};
`;

const dropdownItemStyle = theme => css`
  padding: 7px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  cursor: pointer;
`;

const autocompleteInputStyle = theme => css`
  width: 100%;
  padding: 7px;
  border-radius: 7px;
  border: 1px solid ${theme.greyScale8};
  box-sizing: border-box;
`;

const dropdownMenuStyle = theme => css`
  border-radius: 7px;
  border: 1px solid ${theme.greyScale8};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px;
  background: #fff;
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const DropdownMenu = compose(withTheme)(({ theme, children }) => (
  <div className={dropdownMenuStyle(theme)}>{children}</div>
));

const DropdownLabel = compose(withTheme)(({ theme, children }) => (
  <span className={dropdownLabelStyle(theme)}>{children}</span>
));

const DropdownItem = compose(withTheme)(({ withBorder, withHover, theme, children, ...props }) => (
  <div
    className={`
      ${dropdownItemStyle(theme)}
      ${css`
        ${withBorder ? `border-top: 1px solid ${theme.greyScale8}` : ``};
        &:hover {
          background: ${withHover ? `lightgray` : `white`};
        }
      `}
    `}
    {...props}
  >
    {children}
  </div>
));

const InterestsAutocomplete = compose(
  withApi,
  withTheme,
  withState('inputValue', 'setInputValue', ''),
  withState('suggestions', 'setSuggestions', []),
  withPropsOnChange(['api'], ({ api, setSuggestions }) => ({
    getSuggestions: debounce(async filter => {
      const suggestions = await getTags(api)({ filter, size: 5 });
      setSuggestions(get(suggestions, 'values', []).map(x => x.value) || []);
    }, 300),
  })),
  withProps(({ interests, getSuggestions, setInputValue, setInterests }) => ({
    onInputValueChange: val => {
      const lowered = toLower(val || '');
      setInputValue(lowered);
      getSuggestions(lowered);
    },
    onChange: val => {
      setInterests([...new Set([...interests, val])]);
      setInputValue('');
    },
  })),
)(
  ({
    autoFocus,
    interests,
    theme,
    inputValue,
    suggestions,
    getSuggestions,
    onInputValueChange,
    onChange,
  }) => (
    <Downshift {...{ onInputValueChange, onChange, inputValue, selectedItem: '' }}>
      {({
        getInputProps,
        getItemProps,
        isOpen,
        openMenu,
        initMenu = async () => {
          if (!isOpen) {
            await getSuggestions(inputValue);
            openMenu();
          }
        },
        showSuggestions = (suggestions || []).length,
        showNewItem = inputValue && !(suggestions || []).includes(inputValue),
      }) => (
        <div
          className={css`
            width: 100%;
            position: relative;
          `}
        >
          <input
            className={autocompleteInputStyle(theme)}
            {...getInputProps({
              placeholder: `🔍 Search for interests`,
              onClick: initMenu,
              onFocus: initMenu,
            })}
          />
          {isOpen && (showSuggestions || showNewItem) ? (
            <DropdownMenu>
              {showSuggestions ? (
                <div>
                  <DropdownItem>
                    <DropdownLabel>
                      <Trans>Suggestions:</Trans>
                    </DropdownLabel>
                  </DropdownItem>
                  {suggestions.map(item => (
                    <DropdownItem withHover key={item} {...getItemProps({ item })}>
                      {item}
                    </DropdownItem>
                  ))}
                </div>
              ) : null}
              {showNewItem ? (
                <DropdownItem
                  withHover
                  withBorder={suggestions.length}
                  {...getItemProps({ item: inputValue })}
                >
                  <span
                    className={css`
                      margin-right: 5px;
                    `}
                  >
                    {inputValue}
                  </span>
                  <DropdownLabel>
                    <Trans>(New Interest)</Trans>
                  </DropdownLabel>
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          ) : null}
        </div>
      )}
    </Downshift>
  ),
);

export default InterestsAutocomplete;
