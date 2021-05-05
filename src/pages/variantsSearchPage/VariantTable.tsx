/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table, Tooltip } from 'antd';
// @ts-ignore
import { compose } from 'recompose';

import ROUTES from 'common/routes';
import { addToSqons } from 'common/sqonUtils';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'components/Variants/Empty';
import ServerError from 'components/Variants/ServerError';
import { withHistory } from 'services/history';
import { createQueryInCohortBuilder } from 'store/actionCreators/studyPage';
import {
  ClinVar,
  Consequence,
  Frequencies,
  SelectedSuggestion,
  StudyInfo,
  StudyNode,
  VariantEntity,
  VariantEntityNode,
} from 'store/graphql/variants/models';
import { useVariantSearchTableData } from 'store/graphql/variants/searchActions';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';
import { DispatchVirtualStudies } from 'store/virtualStudiesTypes';
import { AlignmentOptions } from 'ui/TableOptions';
import {
  formatQuotientOrElse,
  formatQuotientToExponentialOrElse,
  generatePaginationMessage,
} from 'utils';

import ConsequencesCell from './ConsequencesCell';

import style from './VariantTable.module.scss';

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;
const MIN_N_OF_PARTICIPANTS_FOR_LINK = 10;

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

const generateColumns = (props: Props, studyList: StudyInfo[]) =>
  [
    {
      title: 'Variant',
      dataIndex: 'hgvsg',
      ellipsis: true,
      className: style.variantTableCell,
      render: (hgvsg: string, record: VariantEntity) =>
        hgvsg ? (
          <Tooltip placement="topLeft" title={hgvsg} color={style.hgvsgTooltipColor}>
            <Link to={`/variant/${record.hash}?hgvsg=${hgvsg}`} href={'#top'}>
              {hgvsg}
            </Link>
          </Tooltip>
        ) : (
          DISPLAY_WHEN_EMPTY_DATUM
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
          DISPLAY_WHEN_EMPTY_DATUM
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
          DISPLAY_WHEN_EMPTY_DATUM
        ),
    },
    {
      title: 'Studies',
      align: AlignmentOptions.center,
      dataIndex: 'studies',
      render: (studies: { hits: { total: number } }, row: VariantEntity) => {
        const nodes: StudyNode[] = row?.studies.hits.edges || [];
        const studyIds = nodes.map((r) => r.node.study_id);

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
            {studies.hits.total || 0}
          </Link>
        ) : (
          0
        );
      },
    },
    {
      title: 'Participants',
      align: AlignmentOptions.left,
      dataIndex: '',
      render: (row: VariantEntity) => {
        const participantNumber = row.participant_number;
        const participantTotalNumber = row.participant_total_number;

        const studyNodes: StudyNode[] = row?.studies.hits.edges || [];
        const hasMinRequiredParticipants = studyNodes.some(
          (s: StudyNode) => s.node.participant_number >= MIN_N_OF_PARTICIPANTS_FOR_LINK,
        );

        const studiesParticipants = hasMinRequiredParticipants
          ? studyNodes.reduce((acc: string[], curr) => {
              const participantsCurrStudy = curr.node.participant_ids || [];
              return [...acc, ...participantsCurrStudy];
            }, [])
          : [];

        return hasMinRequiredParticipants ? (
          <>
            <Button
              onClick={
                participantNumber
                  ? () => {
                      props.onClickParticipantLink(
                        addToSqons({
                          fieldsWValues: [
                            {
                              field: 'kf_id',
                              value: studiesParticipants,
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
              {participantNumber}
            </Button>
            {participantTotalNumber ? ` / ${participantTotalNumber}` : ''}
          </>
        ) : (
          formatQuotientOrElse(participantNumber, participantTotalNumber, DISPLAY_WHEN_EMPTY_DATUM)
        );
      },
    },
    {
      title: 'Frequency',
      dataIndex: '',
      render: (row: VariantEntity) => {
        const participantNumber = row.participant_number;
        const participantTotalNumber = row.participant_total_number;
        return formatQuotientToExponentialOrElse(
          participantNumber,
          participantTotalNumber,
          DISPLAY_WHEN_EMPTY_DATUM,
        );
      },
    },
    {
      title: 'ALT Alleles',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.ac,
    },
    {
      title: 'Homozygotes',
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.homozygotes,
    },
  ].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const makeRows = (rows: VariantEntityNode[]) =>
  rows.map((row: VariantEntityNode, index: number) => ({ ...row.node, key: `${index}` }));

const VariantTable: FunctionComponent<Props> = (props) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const [currentPageSize, setCurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { selectedSuggestion } = props;
  const {
    loading: loadingData,
    results: { variants: data, total },
    studies,
    error,
  } = useVariantSearchTableData(selectedSuggestion, currentPageNum, currentPageSize);

  useEffect(() => {
    //make sure page number is reset when another selection is selected
    setCurrentPageNum(DEFAULT_PAGE_NUM);
  }, [selectedSuggestion.suggestionId]);

  if (error) {
    return <ServerError />;
  }

  return (
    <Table
      title={() =>
        total > 0 ? generatePaginationMessage(currentPageNum, currentPageSize, total) : ''
      }
      tableLayout="auto"
      pagination={{
        current: currentPageNum,
        total: total,
        onChange: (page, pageSize) => {
          if (currentPageNum !== page) {
            setCurrentPageNum(page);
          }
          if (currentPageSize !== pageSize) {
            setCurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
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
