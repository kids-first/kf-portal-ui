import * as React from 'react';
import styled from 'react-emotion';
import Spinner from 'react-spinkit';

// TODO: bringing beagle in through arrangerStyle seems to break the prod build...
import '@arranger/components/public/themeStyles/beagle/beagle.css';
// import arrangerStyle from './arrangerStyle';

import Column from 'uikit/Column';
import Row from 'uikit/Row';
import ControlledAccessIcon from 'icons/ControlledAccessIcon';

export const ArrangerContainer = styled(Row)`
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
  }

  & .tableToolbar {
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
`;

export const TableContainer = styled(Column)`
  flex-grow: 1;
  width: 580px;
  padding: 30px;
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

export const TableWrapper = styled(Column)`
  min-height: 300px;
  flex: 1;
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

export const ControlledIcon = props => <ControlledAccessIcon width={12} height={12} {...props} />;

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

export const TableSpinner = props => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{ width: 50, height: 50 }}
    {...props}
  />
);
