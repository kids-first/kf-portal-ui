/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import ConsequencesCell from './ConsequencesCell';
import { SEARCH_PAGE_SIZE, useVariantSearchTableData } from 'store/graphql/variants/searchActions';
import {
  ClinVar,
  Consequence,
  Frequencies,
  SelectedSuggestion,
  Study,
  StudyInfo,
  VariantEntity,
  VariantEntityNode,
} from 'store/graphql/variants/models';
import { connect, ConnectedProps } from 'react-redux';
import { DispatchVirtualStudies } from 'store/virtualStudiesTypes';
import { Sqon } from 'store/sqon';
import { withHistory } from 'services/history';
// @ts-ignore
import { compose } from 'recompose';
import { Link, RouteComponentProps } from 'react-router-dom';
import ROUTES from 'common/routes';
import { createQueryInCohortBuilder } from 'store/actionCreators/studyPage';
import { RootState } from 'store/rootState';
import { addToSqons } from 'common/sqonUtils';
import { generatePaginationMessage, toExponentialNotation } from 'utils';

import style from './VariantTable.module.scss';

const DEFAULT_PAGE_NUM = 1;
type VariantTableState = {
  currentSqons: Sqon[];
};

const isEven = (n: number) => n % 2 === 0;

const MIN_N_OF_PARTICIPANTS_FOR_LINK = 10;

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

const generateColumns = (props: Props, studyList: StudyInfo[]) =>
  [
    {
      title: 'Variant',
      dataIndex: 'hgvsg',
      ellipsis: true,
      className: style.variantTableCell,
      render: (hgvsg: string, record: VariantEntity) =>
        hgvsg ? (
          <Tooltip placement="topLeft" title={hgvsg} color={'#2b388f'}>
            <Link to={`/variant/${record.hash}?hgvsg=${hgvsg}`} href={'#top'}>
              <Button type="link">
                <div className={style.variantTableLink}>{hgvsg}</div>
              </Button>
            </Link>
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
      className: style.dbSnpTableCell,
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
            {clinVar.clin_sig.join(', ')}
          </a>
        ) : (
          ''
        ),
    },
    {
      title: 'Studies',
      className: style.tableCellAlignRight,
      dataIndex: 'studies',
      render: (studies: { hits: { total: number } }, row: any) => {
        const nodes = row?.studies.hits.edges || [];
        const studyIds = nodes.map((r: { node: { study_id: string } }) => r.node.study_id);

        const studyCodes = studyList.filter((s) => studyIds.includes(s.id)).map((s) => s.code);

        return studies?.hits?.total ? (
          <Link
            to={'/explore'}
            href={'#top'}
            onClick={() => {
              props.onClickParticipantLink(
                addToSqons({
                  fieldsWValues: [{ field: 'study.code', value: studyCodes }],
                  sqons: props.currentSqons,
                }),
              );
              const toTop = document.getElementById('main-page-container');
              toTop?.scrollTo(0, 0);
            }}
          >
            <Button type="link">
              <div className={style.variantTableLink}>{studies?.hits?.total || 0}</div>
            </Button>
          </Link>
        ) : (
          0
        );
      },
    },
    {
      title: 'Participants',
      className: style.tableCellAlignRight,
      dataIndex: 'participant_ids',
      render: (participantIds: string[], row: any) => {
        const size = participantIds?.length || 0;
        const nodes = row?.studies.hits.edges || [];
        const participantsPerStudy = nodes.map(
          (r: { node: { participant_number: string } }) => r.node.participant_number,
        );
        const hasMinRequiredParticipants = !participantsPerStudy.some(
          (s: number) => s < MIN_N_OF_PARTICIPANTS_FOR_LINK,
        );
        return hasMinRequiredParticipants ? (
          <Button
            className={style.variantTableLink}
            onClick={
              size
                ? () => {
                    props.onClickParticipantLink(
                      addToSqons({
                        fieldsWValues: [
                          {
                            field: 'kf_id',
                            value: participantIds,
                          },
                        ],
                        sqons: props.currentSqons,
                      }),
                    );
                    props.history.push(ROUTES.cohortBuilder);
                  }
                : undefined
            }
            type="link"
          >
            {size}
          </Button>
        ) : (
          size
        );
      },
    },
    {
      title: 'ALT Allele',
      className: style.tableCellAlignRight,
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.ac,
    },
    {
      title: 'Total Allele',
      className: style.tableCellAlignRight,
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.an,
    },
    {
      title: 'Allele Freq.',
      className: style.tableCellAlignRight,
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) =>
        toExponentialNotation(frequencies?.internal?.upper_bound_kf?.af),
    },
    {
      title: 'Homozygote',
      className: style.tableCellAlignRight,
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.homozygotes,
    },
  ].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const makeRows = (rows: VariantEntityNode[]) =>
  rows.map((row: VariantEntityNode, index: number) => ({ ...row.node, key: `${index}` }));

const VariantTable: FunctionComponent<Props> = (props) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const { selectedSuggestion } = props;
  const {
    loading: loadingData,
    results: { variants: data, total },
    studies,
  } = useVariantSearchTableData(selectedSuggestion, currentPageNum);

  useEffect(() => {
    //make sure page number is reset when another selection is selected
    setCurrentPageNum(DEFAULT_PAGE_NUM);
  }, [selectedSuggestion.suggestionId]);

  return (
    <Table
      title={() => generatePaginationMessage(currentPageNum, SEARCH_PAGE_SIZE, total)}
      tableLayout="auto"
      pagination={{
        current: currentPageNum,
        total: total,
        onChange: (page) => {
          if (currentPageNum !== page) {
            setCurrentPageNum(page);
          }
        },
      }}
      loading={loadingData}
      dataSource={makeRows(data)}
      columns={generateColumns(props, studies)}
      className={style.table}
      rowClassName={(_, index) => (isEven(index) ? '' : style.rowOdd)}
    />
  );
};

export default compose(withHistory, connector)(VariantTable);
