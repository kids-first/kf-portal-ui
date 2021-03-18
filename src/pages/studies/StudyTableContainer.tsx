import React, { FC } from 'react';
import { Table } from 'antd';
import { studiesColumns } from 'store/graphql/studies/models';
import { StudiesResults } from 'store/graphql/studies/actions';

const StudyTable: FC<StudiesResults> = ({ data, loading }) => {
  const tableData = data?.hits.edges.map((edge) => ({
    ...edge.node,
    key: edge.node.kf_id,
  }));

  if (loading) {
    return null;
  }

  return (
    <div>
      <Table columns={studiesColumns} dataSource={tableData} />
    </div>
  );
};

export default StudyTable;
