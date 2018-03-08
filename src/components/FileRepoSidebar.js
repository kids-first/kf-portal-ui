import React from 'react';
import styled, { css } from 'react-emotion';
import Spinner from 'react-spinkit';

import Button from '../uikit/Button';
import LoadingOnClick from './LoadingOnClick';
import CavaticaSidebar from 'components/cavatica/CavaticaSidebar.js';

import downloadIcon from '../assets/icon-download-white.svg';
import PillInputWithButton from '../uikit/PillInputWithButton';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import InfoIcon from '../icons/InfoIcon';

const styles = {
  container: css`
    flex: none;
    width: 310px;
    background-color: #f4f5f8;
    box-shadow: 0 0 4.9px 0.2px #a0a0a3;
    border: solid 1px #c6c7cc;
    padding: 30px 5px 30px 15px;
  `,
};

function findColumnsByField(fields, columns) {
  return fields
    .map(
      field => (typeof field === 'string' ? columns.find(column => column.field === field) : field),
    )
    .filter(Boolean)
    .map(c => ({ ...c, show: true }));
}

const DownloadIcon = ({ className, loading }) =>
  loading ? (
    <Spinner
      fadeIn="none"
      name="circle"
      color="#fff"
      style={{
        width: 15,
        height: 15,
        marginRight: 9,
      }}
    />
  ) : (
    <img
      alt=""
      src={downloadIcon}
      css={`
        width: 10px;
        margin-right: 9px;
        ${className};
      `}
    />
  );

const Divider = styled('div')`
  height: 1px;
  background-color: #d4d6dd;
  margin: 20px 10px 20px 0;
`;

const Heading = styled('div')`
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #2b388f;
  margin-bottom: 8px;
  font-weight: 500;
`;

export default ({ projectId, index, style, streamData, sqon, graphqlField, ...props }) => (
  <div
    css={`
      ${styles.container} ${style};
    `}
  >
    <Heading
      css={`
        font-size: 18px;
        margin-bottom: 15px;
      `}
    >
      File Action <InfoIcon />
    </Heading>
    <div
      css={`
        font-size: 14px;
        margin-bottom: 30px;
      `}
    >
      If you have not selected any files, all files in your query will be included in the actions.
    </div>
    <Heading>Download</Heading>
    <ColumnsState
      projectId={projectId}
      graphqlField={graphqlField}
      render={({ state }) => {
        return (
          <div>
            <div
              css={`
                display: flex;
                margin-bottom: 13px;
              `}
            >
              <LoadingOnClick
                onClick={() =>
                  saveTSV({
                    sqon,
                    columns: findColumnsByField(['file_id'], state.columns),
                    streamData,
                  })
                }
                render={({ loading, onClick }) => (
                  <Button
                    css={`
                      flex-grow: 1;
                      margin-right: 8px;
                      width: 100%;
                      padding-left: 15px;
                    `}
                    onClick={onClick}
                  >
                    <DownloadIcon loading={loading} />
                    MANIFEST
                  </Button>
                )}
              />

              <div
                css={`
                  flex-grow: 1;
                  width: 100%;
                `}
              />
            </div>
            <Divider />
            <Heading>Reports</Heading>
            <div
              css={`
                display: flex;
                margin-bottom: 13px;
              `}
            >
              <Button
                css={`
                  flex-grow: 1;
                  margin-right: 8px;
                  padding-left: 15px;
                `}
                disabled
              >
                <DownloadIcon />
                CLINICAL DATA
              </Button>
              <Button
                css={`
                  flex-grow: 1;
                  padding-left: 15px;
                `}
                disabled
              >
                <DownloadIcon />BIOSPECIMEN
              </Button>
            </div>

            <LoadingOnClick
              onClick={selectedOption => {
                const columns = findColumnsByField(
                  [
                    'file_id',
                    'file_name',
                    // 'cases.dataset.id',
                    'data_category',
                    'data_type',
                    {
                      Header: 'Case ID',
                      field: 'cases.case_id',
                      listAccessor: 'cases.hits.edges',
                      query: 'cases { hits(first: 99) { edges { node { case_id } } } }',
                      type: 'list',
                    },
                    {
                      Header: 'Sample ID',
                      field: 'cases.samples.sample_id',
                      listAccessor: 'cases.hits.edges',
                      query:
                        'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_id } } } } } } } }',
                      type: 'list',
                    },
                    {
                      Header: 'Sample Type',
                      field: 'cases.samples.sample_type',
                      listAccessor: 'cases.hits.edges',
                      query:
                        'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_type } } } } } } } }',
                      type: 'list',
                    },
                  ],
                  state.columns,
                );

                if (selectedOption === 'Files as unique rows') {
                  return saveTSV({
                    sqon,
                    columns,
                    streamData,
                  });
                } else if (selectedOption === 'Samples as unique rows') {
                  const order = [
                    'cases.samples.sample_id',
                    'cases.samples.sample_type',
                    'cases.case_id',
                    'data_category',
                    'data_type',
                    'file_id',
                    'file_name',
                    // 'cases.dataset.id',
                  ];

                  return saveTSV({
                    sqon,
                    columns: columns.sort((a, b) => {
                      return order.indexOf(a.field) - order.indexOf(b.field);
                    }),
                    streamData,
                    uniqueBy: 'cases.hits.edges[].node.samples.hits.edges[].node.sample_id',
                  });
                }
              }}
              render={({ onClick, loading }) => (
                <PillInputWithButton
                  options={['Samples as unique rows', 'Files as unique rows']}
                  onClick={onClick}
                >
                  <DownloadIcon loading={loading} />
                  SAMPLE SHEET
                </PillInputWithButton>
              )}
            />
          </div>
        );
      }}
    />

    <Divider />
    <Heading>Data Analysis</Heading>
    <CavaticaSidebar {...props} />
  </div>
);
