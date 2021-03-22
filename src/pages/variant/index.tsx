import React from 'react';

type VariantPageProps = {
  title: string;
};

const VariantPage = (props: VariantPageProps) => (
  <div>
    <h1>{props.title || 'Building'}</h1>
  </div>
);

export default VariantPage;
