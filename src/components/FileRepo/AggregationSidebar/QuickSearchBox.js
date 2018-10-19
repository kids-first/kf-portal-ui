import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';
import Spinner from 'react-spinkit';

import { QuickSearch, AggsWrapper } from '@arranger/components/dist/Arranger';

import Row from 'uikit/Row';
import { FilterInput } from 'uikit/Input';
import UploadIdsButton from './UploadIdsButton';

const DropdownItemComponent = ({
  entityName,
  optionIndex,
  inputValue,
  result,
  primaryKey,
  onClick,
}) => (
  <div className={`quick-search-result`} onClick={onClick}>
    <div className={`quick-search-result-entity quick-search-result-entity-${optionIndex}`}>
      <div>{entityName.slice(0, 2).toUpperCase()}</div>
    </div>
    <div className="quick-search-result-details">
      <div className="quick-search-result-key">{primaryKey}</div>
      <div className="quick-search-result-value">
        {result}
        {/* <TextHighlight
          highlightClassName={`quick-search-result-value-highlight`}
          highlightText={inputValue}
          content={result}
        /> */}
      </div>
    </div>
  </div>
);

const QuickSearchBox = compose(withTheme, injectState)(
  ({
    effects,
    state,
    header,
    theme,
    setSQON,
    translateSQONValue,
    graphqlField,
    uploadableFields = null,
    modalTitle,
    inputPlaceholder,
    ...props
  }) => (
    <AggsWrapper displayName={header}>
      <QuickSearch
        {...{ ...props, setSQON, translateSQONValue }}
        InputComponent={FilterInput}
        placeholder={inputPlaceholder || 'Enter Identifiers'}
        LoadingIcon={
          <Spinner fadeIn="none" name="circle" color="#a9adc0" style={{ width: 15, height: 15 }} />
        }
        DropdownItemComponent={DropdownItemComponent}
      />
      <Row mt={'5px'}>
        <UploadIdsButton
          matchboxPlaceholderText={inputPlaceholder}
          {...{
            theme,
            modalTitle,
            effects,
            state,
            setSQON,
            uploadableFields,
            graphqlField,
            ...props,
          }}
        />
      </Row>
    </AggsWrapper>
  ),
);

export default QuickSearchBox;
