import React, { FC } from 'react';
import { Space, Spin, Table } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabClinicalData } from 'store/graphql/variants/tabActions';
import { makeClinVarRows, makeGenesOrderedRow } from './clinical';

type OwnProps = {
  variantId: string;
};

const columnsClinVar = [
  {
    title: 'Interpretation',
    dataIndex: 'interpretation',
  },
  {
    title: 'Condition',
    dataIndex: 'condition',
  },
  {
    title: 'Inheritance',
    dataIndex: 'inheritance',
  },
];

const columnsPhenotypes = [
  {
    title: 'Source',
    dataIndex: 'source',
  },
  {
    title: 'Gene',
    dataIndex: 'condition',
  },
  {
    title: 'Inheritance',
    dataIndex: 'inheritance',
  },
];

const TabClinical: FC<OwnProps> = ({ variantId }) => {
  const { loading, data } = useTabClinicalData(variantId);

  const dataClinvar = data?.clinvar || {};
  const dataGenes = data?.genes || {};

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Table
            title={() => <span>Clinvar [{dataClinvar.clinvar_id}]</span>}
            bordered
            dataSource={makeClinVarRows(dataClinvar)}
            columns={columnsClinVar}
          />
          <Table
            title={() => 'Gene - Phenotype'}
            bordered
            dataSource={makeGenesOrderedRow(dataGenes)}
            columns={columnsPhenotypes}
          />
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabClinical;
