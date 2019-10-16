import * as React from 'react';
import Component from 'react-component-component';
import styled from 'react-emotion';
import Spinner from 'react-spinkit';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';

// TODO: bringing beagle in through arrangerStyle seems to break the prod build...
import '@kfarranger/components/public/themeStyles/beagle/beagle.css';
// import arrangerStyle from './arrangerStyle';

import Column from 'uikit/Column';
import Row from 'uikit/Row';
import ControlledAccessIcon from 'icons/ControlledAccessIcon';
import { TealActionButton } from 'uikit/Button';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import DownloadIcon from 'icons/DownloadIcon';
import noop from 'lodash/noop';
const montserrat = css`
  font-family: 'Montserrat', sans-serif;
`;

const arrangerValueText = css`
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
`;

export const SaveShareButtonContainer = styled(Row)`
  ${({ theme }) => theme.center};
  padding: 10px 5px;
`;

export const ArrangerContainer = styled(Row)`
  min-height: calc(100vh - 56px);

  .ReactTable .rt-thead .rt-th.-sort-desc,
  .ReactTable .rt-thead .rt-td.-sort-desc {
    box-shadow: inset 0 -3px 0 0 rgba(64, 76, 154, 0.7);
  }

  .ReactTable .rt-thead .rt-th.-sort-asc,
  .ReactTable .rt-thead .rt-td.-sort-asc {
    box-shadow: inset 0 3px 0 0 rgba(64, 76, 154, 0.7);
  }

  .tableToolbar {
    border-left: solid 1px #e0e1e6;
    border-right: solid 1px #e0e1e6;
    min-height: 55px;
  }

  & .tableToolbar {
    font-size: 13px;
    color: ${({ theme }) => theme.greyScale9};
    & .group .dropDownButtonContent {
      color: ${({ theme }) => theme.greyScale9};
    }
    & .group button {
      color: ${({ theme }) => theme.greyScale9};
    }
  }

  .pagination-bottom .-pagination {
    color: ${({ theme }) => theme.greyScale9};
    select {
      color: ${({ theme }) => theme.greyScale9};
    }
  }

  div.sqon-view {
    flex-grow: 1;
  }

  & .aggregation-card:last-child {
    margin-bottom: 120px;
  }

  & .aggregation-card {
    .title-wrapper .title {
      ${montserrat};
      font-size: 14px;
      font-weight: 700;
      color: ${({ theme }) => theme.secondary};
    }
    .bucket-item {
      .bucket-link {
        ${arrangerValueText};
        color: ${({ theme }) => theme.greyScale1};
        input[type='checkbox'] {
          float: left;
        }
        .textHighlight,
        .bucket-count {
          display: table;
        }
      }
      .bucket-count {
        display: table;
        min-width: 50px;
        text-align: right;
      }
    }
  }

  & .ReactTable {
    & .rt-thead .rt-tr .rt-th {
      ${montserrat};
      font-size: 13px;
    }
    & .rt-tbody .rt-tl .rt-td {
      ${arrangerValueText};
      color: ${({ theme }) => theme.greyScale1};
    }
    & .rt-td {
      white-space: normal;
    }
  }
`;

export const TableContainer = styled(Column)`
  flex: 1 1 auto;
  width: 580px;
  padding: 30px;
`;

export const TableWrapper = styled(Column)`
  min-height: 300px;
  flex: 1;
  display: flex;
  & .ReactTable {
    min-height: 1px;
  }
`;

export const QuerySharingContainer = styled(Row)`
  border-style: solid;
  border-color: ${({ theme }) => theme.borderGrey};
  border-width: 1px 1px 1px 0;
  background: ${({ theme }) => theme.backgroundGrey};
`;

export const ControlledIcon = withTheme(props => {
  const initialState = {
    mouseIsOver: false,
  };

  const mouseEnterEvent = ({ setState }) => () => {
    setState({ mouseIsOver: true });
  };

  const mouseLeaveEvent = ({ setState }) => () => {
    setState({ mouseIsOver: false });
  };

  const getFillColor = ({ state }) => {
    return !state.mouseIsOver ? props.fill || props.theme.primary : props.theme.hover;
  };

  return (
    <Component initialState={initialState}>
      {s => (
        <a href={props.link} target={props.target}>
          <ControlledAccessIcon
            width={12}
            height={12}
            fill={getFillColor(s)}
            onMouseEnter={mouseEnterEvent(s)}
            onMouseLeave={mouseLeaveEvent(s)}
            {...props}
          >
            {props.children}
          </ControlledAccessIcon>
        </a>
      )}
    </Component>
  );
});

export const OpenIcon = () => (
  <img
    src={require('../../assets/icon-open-access.svg')}
    alt=""
    css={`
      width: 10px;
      margin: auto;
      display: block;
    `}
  />
);

export const TableSpinnerWrapper = styled(Column)`
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const TableSpinner = ({ props, style = {} }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{ width: 50, height: 60, ...style }}
    {...props}
  />
);

const StyledActionButton = styled(TealActionButton)`
  justify-content: flex-start;
  color: ${({ theme, disabled }) => (disabled ? theme.white : 'auto')};
  background: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.lightBlue)};
  width: 100%;
  &:hover {
    background-color: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.tertiary)};
  }
  padding: 0px 10px;
  margin-top: 3px;
  font-size: 11px;
`;

export const cavaticaCopyButtonStyle = props => css`
  justify-content: flex-start;
  margin-top: 3px;
  font-size: 11px;

  & img {
    width: 20px;
  }
`;

export const DownloadButton = compose(withTheme)(
  ({
    onClick,
    theme,
    content = () => <Trans>Download</Trans>,
    buttonRef = React.createRef(),
    disabled = false,
    onBlur = noop,
  }) => {
    return (
      <StyledActionButton
        onClick={onClick}
        innerRef={ref => {
          buttonRef.current = ref;
        }}
        disabled={disabled}
        onBlur={onBlur}
      >
        <DownloadIcon
          className={css`
            height: 28px;
            margin-right: 9px;
          `}
        />
        <span css={theme.uppercase}>{content()}</span>
      </StyledActionButton>
    );
  },
);
