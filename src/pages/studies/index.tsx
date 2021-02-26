import React from 'react';

type DataPageProps = {
  title: string;
};

const DataPage = (props: DataPageProps) => (
  <div>
    <h1>{props.title || 'Building'}</h1>
  </div>
);

export default DataPage;
