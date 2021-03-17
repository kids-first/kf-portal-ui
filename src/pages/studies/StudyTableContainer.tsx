import React, { FC } from 'react';
import { Table } from 'antd';
import { studiesColumns, StudiesResult } from '../../store/graphql/studies/models';

const StudyTableContainer: FC = ({ data, loading }: any) => {
  const tableData = data?.hits.edges.map((edge: { node: StudiesResult }) => ({
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

export default StudyTableContainer;
