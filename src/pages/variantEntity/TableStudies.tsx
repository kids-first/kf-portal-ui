import React, { FC } from 'react';
import { Table } from 'antd';
import { useTableStudiesData } from 'store/graphql/variants/frequenciesTabActions';

type OwnProps = {
  variantId: string;
};

const columns = [
  {
    title: 'Studies',
    dataIndex: 'study_id',
  },
  {
    title: '# Participants',
    dataIndex: 'participant_number',
  },
  {
    title: 'ALT Allele',
    dataIndex: 'studies',
    render: () => 'todo',
  },
  {
    title: 'Homozygote',
    dataIndex: 'frequencies',
    render: () => 'todo',
  },
].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const TableStudies: FC<OwnProps> = ({ variantId }) => {
  const { loading, data } = useTableStudiesData(variantId);

  const { studies } = data;

  return (
    <Table
      title={() => 'Kids First Studies TODO'}
      loading={loading}
      bordered
      dataSource={studies}
      columns={columns}
    />
  );
};

export default TableStudies;
