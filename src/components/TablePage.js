import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'react-emotion';
import SummaryTable from 'uikit/SummaryTable';
import ExternalLink from 'uikit/ExternalLink';

const TablePageWrapper = styled('div')`
  width: 100%;
  min-height: 600px;
  background-color: #fff;
`;
const TablePage = compose(withRouter)(() => (
  <TablePageWrapper>
    Table page
    <SummaryTable
      rows={[
        { title: 'External ID:', summary: 's3-us-east-1.congenitalheart.com/bucket/' },
        { title: 'Name:', summary: 'HN5WHCCXX-8.hgv.bam' },
        { title: 'Study:', summary: <ExternalLink>congenitalheart</ExternalLink> },
        { title: 'Access:', summary: 'Controlled' },
        {
          title: 'Consent Codes:',
          summary: (
            <div>
              <div>phs001138.c1</div>
              <div>SD_PREASA7S</div>
              <ExternalLink>Consent Code Glossary</ExternalLink>
            </div>
          ),
        },
      ]}
    />
  </TablePageWrapper>
));
export default TablePage;
