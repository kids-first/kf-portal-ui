import React from 'react';

type DataPageProps = {
  title: string;
};

export const DataPage = (props: DataPageProps) => (
  <div>
    <h1>{props.title}</h1>
  </div>
);
