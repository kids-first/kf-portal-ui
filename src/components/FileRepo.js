import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import SQONURL from 'components/SQONURL';
import downloadIcon from '../assets/icon-download-grey.svg';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import Measure from 'react-measure';
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

const UploadIdsButton = ({ theme, state, effects, setSQON, ...props }) => (
  <div className={`uploadIdsButton`}>
    <LightButton
      className={`button`}
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
      align="right"
      items={state.loggedInUser.sets.map(x => x.setId)}
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
    <div className={`aggregationsPanel`}>
      <div className={`aggregationsHeader`}>
        <div className={`aggregationsHeaderTitle`}>
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
  access: ({ value }) => {
    if (typeof value !== 'boolean') {
      return 'unknown';
    } else if (value) {
      return (
        <img
          src={require('../assets/icon-controlled-access.svg')}
          alt=""
          className={`accessControlIconImage`}
        />
      );
    } else {
      return (
        <img
          src={require('../assets/icon-open-access.svg')}
          alt=""
          className={`accessControlIconImage`}
        />
      );
    }
  },
};

const FileRepo = compose(injectState, withTheme, withApi)(({ state, effects, theme, ...props }) => (
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
                    <div className={theme.fileRepoContainer}>
                      <AggregationsWrapper {...props} {...url} />
                      <div style={{ flexGrow: 1, width: 580 }}>
                        <div className={`tableContainer ${theme.column}`}>
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
                                    <div className={theme.column}>
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
                          <Measure bounds>
                            {({ measureRef, contentRect }) => (
                              <div
                                ref={measureRef}
                                className={`${theme.column} ${css`
                                  min-height: 300px;
                                `}`}
                              >
                                <Table
                                  {...props}
                                  {...url}
                                  customTypes={customTableTypes}
                                  columnDropdownText="Columns"
                                  fieldTypesForFilter={['text', 'keyword', 'id']}
                                  maxPagesOptions={Math.floor(
                                    (contentRect.bounds.width - 120) / 60,
                                  )}
                                  exportTSVText={
                                    <React.Fragment>
                                      <img
                                        alt=""
                                        src={downloadIcon}
                                        className={`downloadIconImage`}
                                      />
                                      <Trans>Export TSV</Trans>
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
          )
        }
      />
    )}
  />
));

export default FileRepo;
