import React, { FC } from 'react';
import { useGetStudiesPageData } from 'store/graphql/studies/actions';
import { Table } from 'antd';
import { studiesColumns } from '../../store/graphql/studies/models';

const StudyTableContainer: FC = () => {
  const { loading: loadingData, results: data } = useGetStudiesPageData();

  if (loadingData) {
    return null;
  }

  return (
    <div>
      <Table columns={studiesColumns} dataSource={data} />
    </div>
  );
};

export default StudyTableContainer;
