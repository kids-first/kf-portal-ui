/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';
import { Table, Tooltip } from 'antd';
import style from './VariantTable.module.scss';
import ConsequencesCell from './ConsequencesCell';
import { useVariantTableData } from 'store/graphql/variants/actions';
import { SelectedSuggestion } from 'store/graphql/variants/models';

const columns = [
  {
    title: 'Variant',
    dataIndex: 'hgvsg',
    key: 'hgvsg',
    sorter: true,
    ellipsis: true,
    width: '10%',
    render: (
      variant: string, //TODO href
    ) =>
      variant ? (
        <Tooltip placement="topLeft" title={variant} color={'#2b388f'}>
          <a href="test" target="_blank" rel="noopener noreferrer">
            {variant}
          </a>
        </Tooltip>
      ) : (
        ''
      ),
  },
  {
    title: 'Type',
    dataIndex: 'variant_class',
    key: 'variant_class',
  },
  {
    title: 'dbSnp',
    dataIndex: 'rsnumber',
    key: 'rsnumber',
    render: (rsNumber: string) =>
      rsNumber ? (
        <a href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`} target="_blank" rel="noreferrer">
          {rsNumber}
        </a>
      ) : (
        ''
      ),
  },
  {
    title: 'Consequences',
    dataIndex: 'consequences',
    key: 'consequences',
    width: '20%',
    render: (consequences: any[]) => <ConsequencesCell consequences={consequences} />,
  },
  {
    title: 'CLINVAR',
    dataIndex: 'clinvar',
    key: 'clinvar',
    render: (clinVar: { [key: string]: any }) =>
      clinVar?.clin_sig ? (
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clin_sig}`}
          target="_blank"
          rel="noreferrer"
        >
          {clinVar.clin_sig}
        </a>
      ) : (
        ''
      ),
    sorter: true,
  },
  {
    title: '# Studies',
    dataIndex: 'studies',
    key: 'studies',
    render: (studies: { [key: string]: any }) => (studies || []).length,
  },
  {
    title: 'Participant',
    dataIndex: 'participant_number',
    key: 'participant_number',
  },
  {
    title: 'ALT Allele',
    dataIndex: 'frequencies',
    key: 'alt',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.ac,
  },
  {
    title: 'Total Allele',
    dataIndex: 'frequencies',
    key: 'total_allele',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.an,
  },
  {
    title: 'Allele Freq.',
    dataIndex: 'frequencies',
    key: 'freq_allele',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.af,
  },
  {
    title: 'Homozygote',
    dataIndex: 'frequencies',
    key: 'homozygote',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.homozygotes,
  },
];

const isEven = (n: number) => n % 2 === 0;

type Props = { selectedSuggestion: SelectedSuggestion };

const VariantTable: FunctionComponent<Props> = (props) => {
  const { selectedSuggestion } = props;
  const { loading: loadingData, results: data } = useVariantTableData(selectedSuggestion);

  return (
    <Table
      loading={loadingData}
      bordered
      dataSource={data}
      columns={columns}
      className={style.table}
      rowClassName={(_, index) => (isEven(index) ? '' : style.rowOdd)}
    />
  );
};

export default VariantTable;
