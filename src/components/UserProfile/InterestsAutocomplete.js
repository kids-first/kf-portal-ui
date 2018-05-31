import React from 'react';
import { debounce, get, toLower } from 'lodash';
import { compose, withProps, withPropsOnChange, withState } from 'recompose';
import styled from 'react-emotion';
import Downshift from 'downshift';
import { Trans } from 'react-i18next';
import TextHighlight from '@arranger/components/dist/TextHighlight';

import { withApi } from 'services/api';
import { getTags } from 'services/profiles';

const InterestsAutocompleteContainer = styled('div')`
  width: 100%;
  position: relative;
`;

const AutocompleteInput = styled('input')`
  width: 100%;
  padding: 7px;
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.greyScale8};
`;

const DropdownMenu = styled('div')`
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.greyScale8};
  box-shadow: ${({ theme }) => theme.shadow} 0px 1px 8px;
  background: #fff;
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const DropdownLabel = styled('span')`
  text-transform: uppercase;
  font-size: 0.7rem;
  line-height: 0.8rem;
  color: ${({ theme }) => theme.greyScale9};
`;

const DropdownItem = styled('div')`
  padding: 7px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  cursor: pointer;
  ${({ withBorder, theme }) => (withBorder ? `border-top: 1px solid ${theme.greyScale8}` : ``)};
  &:hover {
    background: ${({ withHover }) => (withHover ? `lightgray` : `white`)};
  }
`;

const NewItem = styled('span')`
  margin-right: 5px;
`;

const InterestsAutocomplete = compose(
  withApi,
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
    inputValue,
    suggestions,
    getSuggestions,
    onInputValueChange,
    onChange,
  }) => (
    <Downshift {...{ onInputValueChange, onChange, inputValue, selectedItem: '' }}>
      {({
        getRootProps,
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
        <InterestsAutocompleteContainer {...getRootProps({ refKey: 'innerRef' })}>
          <AutocompleteInput
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
                      <TextHighlight highlightText={inputValue} content={item} />
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
                  <NewItem>{inputValue}</NewItem>
                  <DropdownLabel>
                    <Trans>(New Interest)</Trans>
                  </DropdownLabel>
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          ) : null}
        </InterestsAutocompleteContainer>
      )}
    </Downshift>
  ),
);

export default InterestsAutocomplete;
