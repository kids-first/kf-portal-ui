import React, { FC } from 'react';
import { useGetStudiesPageData } from 'store/graphql/studies/actions';
import { Table } from 'antd';
import { studiesColumns } from '../../store/graphql/studies/models';

const StudyTableContainer: FC = () => {
  const { loading: loadingData, results: data } = useGetStudiesPageData();

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
