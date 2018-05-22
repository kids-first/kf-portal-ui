import React from 'react';
import { debounce, get } from 'lodash';
import { compose, withProps, withPropsOnChange, withState } from 'recompose';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import Downshift from 'downshift';
import { Trans } from 'react-i18next';

import { withApi } from 'services/api';
import { getTags } from 'services/profiles';

const DropdownLabel = compose(withTheme)(({ theme, children }) => (
  <span
    className={css`
      text-transform: uppercase;
      font-size: 0.7rem;
      line-height: 0.8rem;
      color: ${theme.greyScale9};
    `}
  >
    {children}
  </span>
));

const DropdownItem = compose(withTheme)(({ withBorder, withHover, theme, children, ...props }) => (
  <div
    className={css`
      padding: 7px;
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      cursor: pointer;
      ${withBorder ? `border-top: 1px solid ${theme.greyScale8}` : ``};
      &:hover {
        background: ${withHover ? `lightgray` : `white`};
      }
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
      setInputValue(val);
      getSuggestions(val);
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
            await getSuggestions('');
            openMenu();
          }
        },
      }) => (
        <div
          className={css`
            width: 100%;
            position: relative;
          `}
        >
          <input
            className={css`
              width: 100%;
              padding: 7px;
              border-radius: 7px;
              border: 1px solid ${theme.greyScale8};
              box-sizing: border-box;
            `}
            {...getInputProps({
              placeholder: `🔍 Search for interests`,
              onClick: initMenu,
              onFocus: initMenu,
            })}
          />
          {isOpen ? (
            <div
              className={css`
                border-radius: 7px;
                border: 1px solid ${theme.greyScale8};
                box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px;
                background: #fff;
                position: absolute;
                left: 0;
                right: 0;
                overflow: hidden;
              `}
            >
              {suggestions && suggestions.length ? (
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
              {inputValue && (
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
              )}
            </div>
          ) : null}
        </div>
      )}
    </Downshift>
  ),
);

export default InterestsAutocomplete;
