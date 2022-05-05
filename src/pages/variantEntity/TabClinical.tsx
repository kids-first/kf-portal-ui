import React from 'react';
import { ApolloError } from '@apollo/client';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Card, Space, Spin, Table } from 'antd';

import EmptyMessage from 'components/Variants/Empty';
import ServerError from 'components/Variants/ServerError';

import { columnsClinVar, columnsPhenotypes } from './clinicalColumns';
import { makeClinVarRows, makeGenesOrderedRow } from './clinicalRowsGenerators';
import ClinVarExternalLink from './ClinVarExternalLink';

type OwnProps = {
  loading: boolean;
  data: any;
  error: ApolloError | undefined;
};

const TabClinical = (props: OwnProps) => {
  const { loading, data, error } = props;

  if (error) {
    return <ServerError />;
  }

  const dataClinvar = data?.clinvar || {};
  const clinvarId = dataClinvar.clinvar_id;
  const dataGenes = data?.genes || {};

  const clinVarRows = makeClinVarRows(dataClinvar);
  const clinVarHasRows = clinVarRows.length > 0;

  const genesRows = makeGenesOrderedRow(dataGenes);
  const genesHasRows = genesRows.length > 0;

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Card
            title={
              <span>
                Clinvar{' '}
                {clinvarId ? (
                  <ClinVarExternalLink label={`[${clinvarId}]`} clinvarId={clinvarId} />
                ) : (
                  ''
                )}
              </span>
            }
          >
            {clinVarHasRows ? (
              <Table pagination={false} dataSource={clinVarRows} columns={columnsClinVar} />
            ) : (
              <EmptyMessage />
            )}
          </Card>

          <Card title="Gene - Phenotype">
            {genesHasRows ? (
              <Table
                pagination={false}
                dataSource={makeGenesOrderedRow(dataGenes)}
                columns={columnsPhenotypes}
              />
            ) : (
              <EmptyMessage />
            )}
          </Card>
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabClinical;
