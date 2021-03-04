import React, { FunctionComponent } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';
import style from './Variants.module.scss';
import SearchView from './SearchView';

const { Title } = Typography;

const VariantPage: FunctionComponent = () => {
  return (
    <StackLayout vertical className={style.mainContainer}>
      <div className={style.titleContainer}>
        <Title level={3}>The Kids First Variant Database</Title>
      </div>
      <StackLayout className={style.statsAndZepplinContainer} center flexContent fitContent>
        {/* in construction */}
      </StackLayout>
      <SearchView />
    </StackLayout>
  );
};

export default VariantPage;
