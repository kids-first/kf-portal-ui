import React, { FC } from 'react';
import { Table } from 'antd';
import { generateTableData, studiesColumns } from 'store/graphql/studies/models';
import { StudiesResults } from 'store/graphql/studies/actions';

const StudyTable: FC<StudiesResults> = (studiesResults) => {
  const tableData = generateTableData(studiesResults);

  if (studiesResults.loading) {
    return null;
  }

  return (
    <div>
      <Table columns={studiesColumns} dataSource={tableData} />
    </div>
  );
};

export default StudyTable;
