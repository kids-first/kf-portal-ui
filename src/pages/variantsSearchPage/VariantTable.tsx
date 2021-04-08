/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import style from './VariantTable.module.scss';
import ConsequencesCell from './ConsequencesCell';
import { useVariantSearchTableData } from 'store/graphql/variants/searchActions';
import {
  ClinVar,
  Consequence,
  Frequencies,
  SelectedSuggestion,
} from 'store/graphql/variants/models';
import { connect, ConnectedProps } from 'react-redux';
import { DispatchVirtualStudies } from 'store/virtualStudiesTypes';
import { Sqon } from 'store/sqon';
import { withHistory } from 'services/history';
// @ts-ignore
import { compose } from 'recompose';
import { RouteComponentProps } from 'react-router-dom';
import ROUTES from 'common/routes';
import { createQueryInCohortBuilder } from '../../store/actionCreators/studyPage';
import { RootState } from 'store/rootState';
import { addToSqons } from 'common/sqonUtils';

const DEFAULT_PAGE_NUM = 1;
type VariantTableState = {
  currentSqons: Sqon[];
};

const isEven = (n: number) => n % 2 === 0;

const mapDispatch = (dispatch: DispatchVirtualStudies) => ({
  onClickParticipantLink: (sqons: Sqon[]) => dispatch(createQueryInCohortBuilder(sqons)),
});

const mapState = (state: RootState): VariantTableState => ({
  currentSqons: state.currentVirtualStudy.sqons,
});

const connector = connect(mapState, mapDispatch);

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
                    props.onClickParticipantLink(
                      addToSqons({
                        field: 'kf_id',
                        value: participantIds,
                        sqons: props.currentSqons,
                      }),
                    );
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
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.ac,
    },
    {
      title: 'Total Allele',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.an,
    },
    {
      title: 'Allele Freq.',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.af,
    },
    {
      title: 'Homozygote',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.homozygotes,
    },
  ].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const VariantTable: FunctionComponent<Props> = (props) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const { selectedSuggestion } = props;
  const { loading: loadingData, results: data } = useVariantSearchTableData(
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
