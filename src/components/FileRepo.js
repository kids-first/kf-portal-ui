import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import SQONURL from 'components/SQONURL';
import downloadIcon from '../assets/icon-download-grey.svg';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import Measure from 'react-measure';

import {
  Arranger,
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
} from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import FileRepoSidebar from './FileRepoSidebar';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';
import { FileRepoStats, FileRepoStatsQuery } from './Stats';
import { LightButton } from '../uikit/Button';
import InfoIcon from '../icons/InfoIcon';
import AdvancedFacetViewModalContent from './AdvancedFacetViewModal/index.js';
import { arrangerProjectId } from 'common/injectGlobals';

const enhance = compose(injectState);

const arrangerStyles = css`
  display: flex;
  height: 100%;
  box-sizing: border-box;

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

  div.sqon-view {
    flex-grow: 1;
  }
`;

const AggregationsWrapper = injectState(({ state, effects, setSQON, ...props }) => {
  return (
    <div
      css={`
        height: 100%;
        overflow-y: auto;
        background-color: #f4f5f8;
        box-shadow: 0 0 4.9px 0.2px #a0a0a3;
        border: solid 1px #c6c7cc;
        flex: none;
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
        <LightButton
          onClick={() =>
            effects.setModal({
              title: 'All Filters',
              component: (
                <AdvancedFacetViewModalContent
                  {...{
                    ...props,
                    closeModal: effects.unsetModal,
                    onSqonSubmit: ({ sqon }) => {
                      setSQON(sqon);
                      effects.unsetModal();
                    },
                  }}
                />
              ),
            })
          }
        >
          ALL FILTERS
        </LightButton>
      </div>
      <Aggregations {...{ ...props, setSQON }} />
    </div>
  );
});

const customTableTypes = {
  access: ({ value }) => {
    if (typeof value !== 'boolean') {
      return 'unknown';
    } else if (value) {
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
    } else {
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
    }
  },
};

const FileRepo = ({ state, effects, ...props }) => {
  return (
    <SQONURL
      render={url => {
        return (
          <Arranger
            {...props}
            socketConnectionString={window.location.origin}
            socketOptions={{
              path: '/api/socket.io',
            }}
            projectId={arrangerProjectId}
            render={props => {
              const selectionSQON = props.selectedTableRows.length
                ? replaceSQON({
                    op: 'and',
                    content: [
                      { op: 'in', content: { field: 'kf_id', value: props.selectedTableRows } },
                    ],
                  })
                : url.sqon;
              return (
                <div
                  css={`
                    height: 1px;
                    flex: 1;
                  `}
                >
                  <DetectNewVersion {...props} />
                  <div css={arrangerStyles}>
                    <AggregationsWrapper {...props} {...url} />
                    <div style={{ flexGrow: 1, width: 580 }}>
                      <div
                        css={`
                          padding: 30px;
                          display: flex;
                          flex-direction: column;
                          position: relative;
                          height: 100%;
                          box-sizing: border-box;
                          overflow-y: auto;
                        `}
                      >
                        <div
                          css={`
                            flex: none;
                            display: flex;
                          `}
                        >
                          <CurrentSQON {...props} {...url} />
                          {url.sqon &&
                            Object.keys(url.sqon).length > 0 && (
                              <FileRepoStatsQuery
                                {...props}
                                {...url}
                                render={data => (
                                  <div
                                    css={`
                                      display: flex;
                                      flex-direction: column;
                                    `}
                                  >
                                    <ShareQuery
                                      stats={data}
                                      {...url}
                                      css={`
                                        flex: 1;
                                      `}
                                    />
                                    <SaveQuery
                                      stats={data}
                                      {...url}
                                      css={`
                                        flex: 1;
                                      `}
                                    />
                                  </div>
                                )}
                              />
                            )}
                        </div>
                        <FileRepoStats
                          {...props}
                          sqon={selectionSQON}
                          css={`
                            flex: none;
                          `}
                        />
                        <Measure bounds>
                          {({ measureRef, contentRect }) => (
                            <div
                              ref={measureRef}
                              css={`
                                display: flex;
                                flex-direction: column;
                                min-height: 300px;
                              `}
                            >
                              <Table
                                {...props}
                                {...url}
                                customTypes={customTableTypes}
                                columnDropdownText="Columns"
                                fieldTypesForFilter={['text', 'keyword', 'id']}
                                maxPagesOptions={Math.floor((contentRect.bounds.width - 120) / 60)}
                                exportTSVText={
                                  <React.Fragment>
                                    <img
                                      alt=""
                                      src={downloadIcon}
                                      css={`
                                        width: 10px;
                                        margin-right: 9px;
                                      `}
                                    />Export TSV
                                  </React.Fragment>
                                }
                              />
                            </div>
                          )}
                        </Measure>
                      </div>
                    </div>
                    <FileRepoSidebar {...props} sqon={selectionSQON} />
                  </div>
                </div>
              );
            }}
          />
        );
      }}
    />
  );
};

export default enhance(FileRepo);
