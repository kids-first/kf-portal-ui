import React from 'react';
import { Card, Space, Spin, Table } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabClinicalData } from 'store/graphql/variants/tabActions';
import {
  columnsClinVar,
  columnsPhenotypes,
  makeClinVarRows,
  makeGenesOrderedRow,
} from './clinical';
import TabError from './TabError';
import ClinVarExternalLink from './ClinVarExternalLink';

type OwnProps = {
  variantId: string;
};

const TabClinical = ({ variantId }: OwnProps) => {
  const { loading, data, error } = useTabClinicalData(variantId);

  if (error) {
    return <TabError />;
  }

  const dataClinvar = data?.clinvar || {};
  const clinvarId = dataClinvar.clinvar_id;
  const dataGenes = data?.genes || {};

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Card
            title={
              <span>
                Clinvar {clinvarId ? <ClinVarExternalLink clinvarId={`[${clinvarId}]`} /> : ''}
              </span>
            }
          >
            <Table
              pagination={false}
              dataSource={makeClinVarRows(dataClinvar)}
              columns={columnsClinVar}
            />
          </Card>
          <Card title="Gene - Phenotype">
            <Table
              pagination={false}
              dataSource={makeGenesOrderedRow(dataGenes)}
              columns={columnsPhenotypes}
            />
          </Card>
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabClinical;
