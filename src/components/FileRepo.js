import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';

import Arranger, {
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
} from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import FileRepoSidebar from './FileRepoSidebar';
import Stats from './Stats';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';
import { LightButton } from '../uikit/Button';
import InfoIcon from '../icons/InfoIcon';

const enhance = compose(injectState);

const arrangerStyles = css`
  display: flex;

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
`;

const AggregationsWrapper = props => {
  return (
    <div
      css={`
        flex: none;
        background-color: #f4f5f8;
        box-shadow: 0 0 4.9px 0.2px #a0a0a3;
        border: solid 1px #c6c7cc;
        & > * {
          margin-left: -1px;
        }
      `}
    >
      <div
        css={`
          display: flex;
          padding: 15px 7px 15px 12px;
        `}
      >
        <div
          css={`
            flex-grow: 1;
            font-size: 18px;
            color: #2b388f;
          `}
        >
          Filters <InfoIcon />
        </div>
        <LightButton>ALL FILTERS</LightButton>
      </div>
      <Aggregations {...props} />
    </div>
  );
};

const customTableTypes = {
  access: ({ value }) => {
    switch (value) {
      case 'controlled':
        return (
          <img
            src={require('../assets/icon-controlled-access.svg')}
            alt=""
            css={`
              width: 11px;
              margin: auto;
              display: block;
            `}
          />
        );
      case 'open':
        return (
          <img
            src={require('../assets/icon-open-access.svg')}
            alt=""
            css={`
              width: 10px;
              margin: auto;
              display: block;
            `}
          />
        );
      default:
        return 'unknown';
    }
  },
};

const FileRepo = ({ state, effects }) => {
  return (
    <Arranger
      index="file"
      projectId={process.env.REACT_APP_PROJECT_ID}
      render={props => {
        const selectionSQON = props.selectedTableRows.length
          ? replaceSQON({
              op: 'and',
              content: [
                { op: 'in', content: { field: 'file_id', value: props.selectedTableRows } },
              ],
            })
          : props.sqon;

        return (
          <div>
            <DetectNewVersion {...props} />
            <div css={arrangerStyles}>
              <AggregationsWrapper {...props} />

              <div
                style={{
                  position: 'relative',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 30,
                }}
              >
                <CurrentSQON {...props} />
                <Stats {...props} sqon={selectionSQON} />
                <Table {...props} customTypes={customTableTypes} />
              </div>
              <FileRepoSidebar
                {...props}
                sqon={selectionSQON}
                streamData={props.streamData(props.index, props.projectId)}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default enhance(FileRepo);
