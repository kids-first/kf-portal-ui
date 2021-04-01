/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, Table, Tooltip } from 'antd';
import style from './VariantTable.module.scss';
import ConsequencesCell from './ConsequencesCell';
import { useVariantTableData } from 'store/graphql/variants/actions';
import {
  ClinVar,
  Consequence,
  Frequencies,
  SelectedSuggestion,
} from 'store/graphql/variants/models';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { connect, ConnectedProps } from 'react-redux';
import { DispatchVirtualStudies } from 'store/virtualStudiesTypes';
import { Sqon } from 'store/sqon';
import { withHistory } from 'services/history';
// @ts-ignore
import { compose } from 'recompose';
import { RouteComponentProps } from 'react-router-dom';
import { generateKfIdsSqon } from 'store/sqonUtils';
import ROUTES from '../../common/routes';

const DEFAULT_PAGE_NUM = 1;

const isEven = (n: number) => n % 2 === 0;

const mapDispatch = (dispatch: DispatchVirtualStudies) => ({
  setSqons: (sqons: Sqon | Sqon[]) => dispatch(setSqons(sqons)),
});

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  selectedSuggestion: SelectedSuggestion;
  history: RouteComponentProps['history'];
} & PropsFromRedux;

const generateColumns = (props: Props) =>
  [
    {
      title: 'Variant',
      dataIndex: 'hgvsg',
      sorter: true,
      ellipsis: true,
      width: '10%',
      render: (hgvsg: string) =>
        hgvsg ? (
          <Tooltip placement="topLeft" title={hgvsg} color={'#2b388f'}>
            {hgvsg}
          </Tooltip>
        ) : (
          ''
        ),
    },
    {
      title: 'Type',
      dataIndex: 'variant_class',
    },
    {
      title: 'dbSnp',
      dataIndex: 'rsnumber',
      render: (rsNumber: string) =>
        rsNumber ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`}
          >
            {rsNumber}
          </a>
        ) : (
          ''
        ),
    },
    {
      title: 'Consequences',
      dataIndex: 'consequences',
      width: '20%',
      render: (consequences: { hits: { edges: Consequence[] } }) => (
        <ConsequencesCell consequences={consequences?.hits?.edges || []} />
      ),
    },

    {
      title: 'CLINVAR',
      dataIndex: 'clinvar',
      render: (clinVar: ClinVar) =>
        clinVar?.clin_sig && clinVar.clinvar_id ? (
          <a
            href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}
            target="_blank"
            rel="noopener noreferrer"
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
      render: (studies: { hits: { total: number } }) => studies?.hits?.total || 0,
    },
    {
      title: 'Participant',
      dataIndex: 'participant_ids',
      render: (participantIds: string[]) => {
        const size = participantIds?.length || 0;
        return (
          <Button
            onClick={
              size
                ? () => {
                    props.setSqons([generateKfIdsSqon(participantIds)]);
                    props.history.push(ROUTES.cohortBuilder);
                  }
                : undefined
            }
            type="link"
          >
            [{size}]
          </Button>
        );
      },
    },
    {
      title: 'ALT Allele',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.combined?.ac,
    },
    {
      title: 'Total Allele',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.combined?.an,
    },
    {
      title: 'Allele Freq.',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.combined?.af,
    },
    {
      title: 'Homozygote',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.combined?.homozygotes,
    },
  ].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const VariantTable: FunctionComponent<Props> = (props) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const { selectedSuggestion } = props;
  const { loading: loadingData, results: data } = useVariantTableData(
    selectedSuggestion,
    currentPageNum,
  );

  useEffect(() => {
    //make sure page number is reset when another selection is selected
    setCurrentPageNum(DEFAULT_PAGE_NUM);
  }, [selectedSuggestion.suggestionId]);

  return (
    <Table
      pagination={{
        current: currentPageNum,
        total: data.total,
        onChange: (page) => {
          if (currentPageNum !== page) {
            setCurrentPageNum(page);
          }
        },
      }}
      loading={loadingData}
      bordered
      dataSource={data.nodes}
      columns={generateColumns(props)}
      className={style.table}
      rowClassName={(_, index) => (isEven(index) ? '' : style.rowOdd)}
    />
  );
};

export default compose(withHistory, connector)(VariantTable);
