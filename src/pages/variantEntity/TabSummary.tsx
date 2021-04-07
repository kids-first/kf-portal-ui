import React, { FC } from 'react';
import { useTabSummaryData } from 'store/graphql/variants/tabActions';
import { Spin } from 'antd';
import VariantSummaryOverview from './VariantSummaryOverview';
import { VariantEntityResults } from 'store/graphql/variants/models';

import style from './VariantEntity.module.scss';
import Title from 'antd/es/typography/Title';

type OwnProps = {
  variantId: string;
};

const TabSummary: FC<OwnProps> = ({ variantId }) => {
  const { data, loading }: VariantEntityResults = useTabSummaryData(variantId);

  if (loading) {
    return null;
  }

  return (
    <Spin spinning={loading}>
      <div className={style.summaryTabOverviewContainer}>
        <VariantSummaryOverview variant={data!.hits.edges[0].node} />
        <div>Gene Consequences</div>
      </div>
    </Spin>
  );
};

export default TabSummary;
