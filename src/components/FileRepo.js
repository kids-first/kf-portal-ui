import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import SQONURL from 'components/SQONURL';
import downloadIcon from '../assets/icon-download-grey.svg';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';

import {
  Arranger,
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
  QuickSearch,
} from '@arranger/components/dist/Arranger';
import { toggleSQON } from '@arranger/components/dist/SQONView/utils';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import FileRepoSidebar from './FileRepoSidebar';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';
import { FileRepoStats, FileRepoStatsQuery } from './Stats';
import { LightButton } from '../uikit/Button';
import InfoIcon from '../icons/InfoIcon';
import AdvancedFacetViewModalContent from './AdvancedFacetViewModal';
import UploadIdsModal from './UploadIdsModal';
import { arrangerProjectId } from 'common/injectGlobals';
import Select from '../uikit/Select';
import translateSQONValue from 'common/translateSQONValue';
import { withApi } from 'services/api';
import ArrangerConnectionGuard from './ArrangerConnectionGuard';

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

const UploadIdsButton = ({ theme, state, effects, setSQON, ...props }) => (
  <div
    className={css`
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    `}
  >
    <LightButton
      className={css`
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      `}
      onClick={() =>
        effects.setModal({
          title: 'Upload a List of Identifiers',
          component: <UploadIdsModal {...{ ...props, setSQON }} closeModal={effects.unsetModal} />,
        })
      }
    >
      <Trans css={theme.uppercase}>Upload Ids</Trans>
    </LightButton>
    <Select
      className={css`
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: none;
        padding-left: 0;
      `}
      align="right"
      items={state.loggedInUser.sets.map(x => x.setId)}
      itemContainerClassName={css`
        padding: 0px;
        box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.43);
      `}
      itemClassName={css`
        &:hover {
          background-color: ${theme.optionSelected};
        }
      `}
      onChange={(setId, { clearSelection }) => {
        if (setId) {
          setSQON(
            toggleSQON(
              {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'kf_id',
                      value: [`set_id:${setId}`],
                    },
                  },
                ],
              },
              props.sqon,
            ),
          );
        }
        clearSelection();
      }}
    />
  </div>
);

const AggregationsWrapper = compose(injectState, withTheme)(
  ({ state, effects, theme, setSQON, aggregationsWrapperRef = React.createRef(), ...props }) => (
    <div
      ref={aggregationsWrapperRef}
      css={`
        height: 100%;
        height: calc(100vh - 180px);
        overflow-y: auto;
        background-color: #f4f5f8;
        box-shadow: 0 0 4.9px 0.2px #a0a0a3;
        border: solid 1px #c6c7cc;
        flex: none;
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
          <Trans>Filters</Trans> <InfoIcon />
        </div>
        <LightButton
          css={theme.uppercase}
          onClick={() =>
            effects.setModal({
              title: 'All Filters',
              classNames: {
                modal: css`
                  width: 80%;
                  height: 90%;
                  max-width: initial;
                `,
              },
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
          <Trans css={theme.uppercase}>All Filters</Trans>
        </LightButton>
      </div>
      <div className="aggregation-card">
        <QuickSearch
          {...{ ...props, setSQON }}
          placeholder="Enter Identifiers"
          translateSQONValue={translateSQONValue({ sets: (state.loggedInUser || {}).sets })}
          LoadingIcon={
            <Spinner
              fadeIn="none"
              name="circle"
              color="#a9adc0"
              style={{ width: 15, height: 15 }}
            />
          }
        />
        <UploadIdsButton {...{ theme, effects, state, setSQON, ...props }} />
      </div>
      <Aggregations {...{ ...props, setSQON, containerRef: aggregationsWrapperRef }} />
    </div>
  ),
);

const customTableTypes = {
  access: ({ value }) =>
    typeof value !== 'boolean' ? (
      ``
    ) : value ? (
      <img
        src={require('../assets/icon-controlled-access.svg')}
        alt=""
        css={`
          width: 11px;
          margin: auto;
          display: block;
        `}
      />
    ) : (
      <img
        src={require('../assets/icon-open-access.svg')}
        alt=""
        css={`
          width: 10px;
          margin: auto;
          display: block;
        `}
      />
    ),
};

const FileRepo = compose(injectState, withTheme, withApi)(({ state, effects, ...props }) => (
  <SQONURL
    render={url => (
      <ArrangerConnectionGuard
        graphqlField={props.graphqlField}
        render={({ connecting, connectionError }) =>
          connecting || connectionError ? (
            <div
              css={`
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              {connectionError ? (
                `Unable to connect to the file repo, please try again later`
              ) : (
                <Spinner
                  fadeIn="none"
                  name="circle"
                  color="#a9adc0"
                  style={{ width: 50, height: 50 }}
                />
              )}
            </div>
          ) : (
            <Arranger
              {...props}
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
                            <CurrentSQON
                              {...props}
                              {...url}
                              translateSQONValue={translateSQONValue({
                                sets: state.loggedInUser.sets,
                              })}
                            />
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
                                        api={props.api}
                                        {...url}
                                        css={`
                                          flex: 1;
                                        `}
                                      />
                                      <SaveQuery
                                        stats={data}
                                        api={props.api}
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
                          <div
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
                              maxPagesOptions={5}
                              exportTSVText={
                                <React.Fragment>
                                  <img
                                    alt=""
                                    src={downloadIcon}
                                    css={`
                                      width: 10px;
                                      margin-right: 9px;
                                    `}
                                  />
                                  <Trans>Export TSV</Trans>
                                </React.Fragment>
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <FileRepoSidebar {...props} sqon={selectionSQON} />
                    </div>
                  </div>
                );
              }}
            />
          )
        }
      />
    )}
  />
));

export default FileRepo;
