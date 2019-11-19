import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import Spinner from 'react-spinkit';

import { QuickSearch, AggsWrapper } from '@kfarranger/components/dist/Arranger';
import { TextHighlight } from '@kfarranger/components/dist';

import theme from 'theme/defaultTheme';
import Row from 'uikit/Row';
import { FilterInput } from 'uikit/Input';
import UploadIdsButton from './UploadIdsButton';
import FlaskSvg from 'icons/FlaskIcon';
import ParticipantSvg from 'icons/ParticipantIcon';
import FileSvg from 'icons/FileIcon';

import styles from './AggregationSidebar.module.css';

const IconContainer = ({ children, borderColor, backgroundColor, ...props }) => (
  <div
    className={styles.iconContainer}
    style={{
      border: `solid 2px ${borderColor}`,
      background: backgroundColor,
    }}
  >
    {children}
  </div>
);

const ParticipantIcon = () => (
  <IconContainer borderColor={theme.white} backgroundColor={theme.highlight}>
    <ParticipantSvg width={15} height={15} fill={theme.white} />
  </IconContainer>
);

const BiospecimenIcon = () => (
  <IconContainer borderColor={theme.white} backgroundColor={theme.orange}>
    <FlaskSvg width={15} height={15} />
  </IconContainer>
);

const FileIcon = () => (
  <IconContainer borderColor={theme.white} backgroundColor={theme.tertiary}>
    <FileSvg size="15px" fill={theme.white} />
  </IconContainer>
);

const DropdownItemComponent = ({ inputValue, result, primaryKey, IconComponent, onMouseDown }) => (
  // onMouseDown because the quicksearch input's onBlur would prevent onClick from triggering
  <div className={`quick-search-result`} onMouseDown={onMouseDown}>
    <IconComponent />
    <div className="quick-search-result-details">
      <div className="quick-search-result-key">{primaryKey}</div>
      <div className="quick-search-result-value">
        <TextHighlight highlightText={inputValue} content={result} />
      </div>
    </div>
  </div>
);

const QuickSearchBox = compose(injectState)(
  ({
    effects,
    state,
    header,
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
        DropdownItemComponent={({ ...props }) => {
          const { entityName } = props;
          return (
            <DropdownItemComponent
              IconComponent={
                entityName === 'Participants'
                  ? ParticipantIcon
                  : entityName === 'Biospecimens'
                  ? BiospecimenIcon
                  : FileIcon
              }
              {...props}
            />
          );
        }}
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
