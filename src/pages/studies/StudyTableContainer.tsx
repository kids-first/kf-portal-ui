import React, { FC } from 'react';
import { useGetStudiesPageData } from 'store/graphql/studies/actions';
import { Table } from 'antd';
import { studiesColumns, StudiesResult } from '../../store/graphql/studies/models';

const StudyTableContainer = ({ data, loading }: any): React.ReactElement => {
  const tableData = data?.hits.edges.map((edge: { node: StudiesResult }) => ({
    ...edge.node,
  }));

  if (loadingData) {
    return null;
  }

  const keyedData = data.map((d: any) => {
    d.key = d.kf_id;
    return d;
  });

  return (
    <div>
      <Table columns={studiesColumns} dataSource={keyedData} />
    </div>
  );
};

export default StudyTableContainer;
