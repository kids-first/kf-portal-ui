/* eslint-disable react/display-name */
import React, { FC } from 'react';

import { Table } from 'antd';

import PageContent from 'components/Layout/PageContent';
import { studiesColumns } from 'store/graphql/studies/models';
import { getStudiesPageData } from 'store/graphql/studies/actions';

const StudiesPage: FC = () => {
  const { loading: loadingData, results: data } = getStudiesPageData()();

  if (loadingData) {
    return null;
  }

  return (
    <PageContent title="Studies">
      <Table columns={studiesColumns} dataSource={data} />
    </PageContent>
  );
};

export default StudiesPage;
