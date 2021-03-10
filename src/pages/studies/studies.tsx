/* eslint-disable react/display-name */
import React, { FC } from 'react';
import { getStudiesPageData } from 'store/graphql/studies/actions';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import PageContent from '../../components/Layout/PageContent';
import StudiesFiltersSider from './StudiesFiltersSider';


interface IBucket {
  doc_count: number;
  key: string;
}

interface IAggregation {
  buckets: IBucket[];
}



const Studies: FC = () => {
  const { loading: loadingData, results: data } = getStudiesPageData()();

  if (loadingData) {
    return null;
  }

  return (
    <StackLayout horizontal>
      <StudiesFiltersSider />
      <PageContent title="Studies">
        {/*<Table columns={studiesColumns} dataSource={data} />*/}
      </PageContent>
    </StackLayout>
  );
};

export default Studies;
