import React, { FunctionComponent } from 'react';
import { Table } from 'antd';
import style from './VariantTable.module.scss';
import { Spinner } from '../../uikit/Spinner';

type OwnProps = {
  isLoading: boolean;
  dataSource: any[];
};

const columns = [
  {
    title: 'Variant',
    dataIndex: 'variant',
    key: 'variant',
    sorter: true,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'dbSnp',
    dataIndex: 'dbSnp',
    key: 'dbSnp',
  },
  {
    title: 'Consequence',
    dataIndex: 'consequence',
    key: 'consequence',
  },
  {
    title: 'CLINVAR',
    dataIndex: 'clinvar',
    key: 'clinvar',
    sorter: true,
  },
  {
    title: 'Study',
    dataIndex: 'study',
    key: 'study',
  },
  {
    title: 'Participant',
    dataIndex: 'participant',
    key: 'participant',
  },
  {
    title: 'ALT Allele',
    dataIndex: 'altAllele',
    key: 'altAllele',
  },
  {
    title: 'Total Allele',
    dataIndex: 'totalAllele',
    key: 'totalAllele',
  },
  {
    title: 'Allele Freq.',
    dataIndex: 'alleleFreq',
    key: 'alleleFreq',
  },
  {
    title: 'Homozygote',
    dataIndex: 'homozygote',
    key: 'homozygote',
  },
];

const VariantTable: FunctionComponent<OwnProps> = ({ isLoading, dataSource }) => {
  if (isLoading) {
    return <Spinner />;
  }
  return <Table bordered dataSource={dataSource} columns={columns} className={style.table} />;
};

export default VariantTable;
