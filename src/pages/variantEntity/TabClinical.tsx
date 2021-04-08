import React from 'react';
import { Result, Space, Spin, Table } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabClinicalData } from 'store/graphql/variants/tabActions';
import {
  columnsClinVar,
  columnsPhenotypes,
  makeClinVarRows,
  makeGenesOrderedRow,
} from './clinical';

type OwnProps = {
  variantId: string;
};

const TabClinical = ({ variantId }: OwnProps) => {
  const { loading, data, error } = useTabClinicalData(variantId);

  if (error) {
    return (
      <Result
        status="500"
        title="Server Error"
        subTitle="An error has occured and we are not able to load content at this time."
      />
    );
  }

  const dataClinvar = data?.clinvar || {};
  const clinvarId = dataClinvar.clinvar_id;
  const dataGenes = data?.genes || {};

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Table
            title={() => <span>Clinvar {clinvarId ? `[${dataClinvar.clinvar_id}]` : ''}</span>}
            dataSource={makeClinVarRows(dataClinvar)}
            columns={columnsClinVar}
          />
          <Table
            title={() => 'Gene - Phenotype'}
            dataSource={makeGenesOrderedRow(dataGenes)}
            columns={columnsPhenotypes}
          />
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabClinical;
