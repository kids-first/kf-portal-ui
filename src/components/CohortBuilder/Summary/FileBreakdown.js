import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

import BaseDataTable from 'uikit/DataTable';
import { CardSlot } from './index';
import MultiHeader from 'uikit/Multicard/MultiHeader';

const FileBreakdownWrapper = styled('div')``;

const columnStyles = {
  margin: '-2% 0',
};

const Column = styled('span')`
  font-size: 11px;
`;

const FilesColumn = styled(Column)`
  color: ${({ theme }) => theme.hover};
  text-decoration: underline;
`;

const sumTotalFilesInData = dataset => {
  return dataset.reduce((accumulator, datum) => {
    return accumulator + parseInt(datum.files, 10);
  }, 0);
};

const SEARCH_FILE_RELATIVE_URL = '/search/file';

const generateFileRepositoryUrl = (dataType, experimentalStrategy) => {
  return (
    `${SEARCH_FILE_RELATIVE_URL}?sqon=` +
    encodeURI(
      JSON.stringify({
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'data_type',
              value: [dataType],
            },
          },
          {
            op: 'in',
            content: {
              field: 'sequencing_experiments.experiment_strategy',
              value: [experimentalStrategy],
            },
          },
        ],
      }),
    )
  );
};

const localizeFileQuantity = quantity => {
  return `${Number(quantity).toLocaleString()}`;
};

const generateFileColumnContents = dataset => {
  return dataset.map(datum => {
    return {
      ...datum,
      fileLink: (
        <a href={generateFileRepositoryUrl(datum.dataType, datum.experimentalStrategy)}>
          {localizeFileQuantity(datum.files)}
        </a>
      ),
    };
  });
};

const FileBreakdown = ({ data }) => {
  const finalData = generateFileColumnContents(data);
  const filesTotal = localizeFileQuantity(sumTotalFilesInData(finalData));
  return (
    <FileBreakdownWrapper>
      <CardSlot
        scrollable={true}
        title={
          <MultiHeader
            headings={[{ title: 'Available Data', badge: filesTotal ? filesTotal : null }]}
          />
        }
      >
        <BaseDataTable
          header={null}
          columns={[
            {
              Header: 'Data Type',
              accessor: 'dataType',
              minWidth: 75,
              style: columnStyles,
            },
            {
              Header: 'Experimental Strategy',
              accessor: 'experimentalStrategy',
              style: columnStyles,
            },
            {
              Header: 'Files',
              accessor: 'fileLink',
              minWidth: 40,
              style: columnStyles,
            },
          ]}
          className="-striped -highlight"
          data={finalData}
          transforms={{
            dataType: dataType => <Column>{dataType}</Column>,
            experimentalStrategy: experimentalStrategy => <Column>{experimentalStrategy}</Column>,
            fileLink: fileLink => <FilesColumn>{fileLink}</FilesColumn>,
          }}
        />
      </CardSlot>
    </FileBreakdownWrapper>
  );
};

export default compose(withTheme)(FileBreakdown);
