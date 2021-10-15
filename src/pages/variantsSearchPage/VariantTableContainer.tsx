/* eslint-disable react/display-name */
import React, { FunctionComponent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { Table, Tooltip } from 'antd';

import ROUTES from 'common/routes';
import { addToSqons } from 'common/sqonUtils';
import TableTitle from 'components/Table/TableTitle';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'components/Variants/Empty';
import { createQueryInCohortBuilder } from 'store/actionCreators/virtualStudies';
import { StudiesResult } from 'store/graphql/studies/models';
import {
  ClinVar,
  Consequence,
  Frequencies,
  StudyNode,
  VariantEntity,
  VariantEntityNode,
} from 'store/graphql/variants/models';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';
import { DispatchVirtualStudies } from 'store/virtualStudiesTypes';
import { formatQuotientOrElse, toExponentialNotation } from 'utils';

import ConsequencesCell from './ConsequencesCell';
import { DEFAULT_PAGE_SIZE, VariantPageResults } from './VariantPageContainer';

import style from './VariantTableContainer.module.scss';

const DEFAULT_PAGE_NUM = 1;
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

type Props = PropsFromRedux & {
  results: VariantPageResults;
  filters: ISyntheticSqon;
  setCurrentPageCb: (currentPage: number) => void;
  currentPageSize: number;
  setcurrentPageSize: (currentPage: number) => void;
};

const generateColumns = (props: Props, studyList: StudiesResult[]) =>
  [
    {
      title: 'Variant',
      dataIndex: 'hgvsg',
      ellipsis: true,
      width: 200,
      className: style.variantTableCell,
      render: (hgvsg: string, record: VariantEntity) =>
        hgvsg ? (
          <Tooltip placement="topLeft" title={hgvsg}>
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
      width: 300,
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
      dataIndex: 'studies',
      render: (studies: { hits: { total: number } }, row: VariantEntity) => {
        const nodes: StudyNode[] = row?.studies?.hits.edges || [];
        const studyIds = nodes.map((r) => r.node.study_id);
        const studyCodes = studyList.filter((s) => studyIds.includes(s.id)).map((s) => s.code);

        return studies?.hits?.total ? (
          <Link
            to={ROUTES.cohortBuilder}
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
            {studies?.hits.total || 0}
          </Link>
        ) : (
          0
        );
      },
    },
    {
      title: <Tooltip title="Participants">Part.</Tooltip>,
      dataIndex: '',
      width: 90,
      render: (row: VariantEntity) => {
        const participantNumber = row.participant_number;
        const participantTotalNumber = row.participant_total_number;

        const studyNodes: StudyNode[] = row?.studies?.hits.edges || [];
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
            <Link
              to={ROUTES.cohortBuilder}
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
                    }
                  : undefined
              }
            >
              {participantNumber}
            </Link>
            {participantTotalNumber ? ` / ${participantTotalNumber}` : ''}
          </>
        ) : (
          formatQuotientOrElse(participantNumber, participantTotalNumber, DISPLAY_WHEN_EMPTY_DATUM)
        );
      },
    },
    {
      title: <Tooltip title="Frequency">Freq.</Tooltip>,
      dataIndex: '',
      width: 90,
      render: (row: VariantEntity) => {
        const participant_frequency = row.participant_frequency;
        return participant_frequency
          ? toExponentialNotation(participant_frequency)
          : DISPLAY_WHEN_EMPTY_DATUM;
      },
    },
    {
      title: <Tooltip title="ALT Alleles">ALT</Tooltip>,
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.ac,
    },
    {
      title: <Tooltip title="Homozygotes">Homo</Tooltip>,
      dataIndex: 'frequencies',
      render: (frequencies: Frequencies) => frequencies?.internal?.upper_bound_kf?.homozygotes,
    },
  ].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const makeRows = (rows: VariantEntityNode[]) =>
  rows.map((row: VariantEntityNode, index: number) => ({ ...row.node, key: `${index}` }));

const VariantTableContainer: FunctionComponent<Props> = (props) => {
  const { results, setCurrentPageCb, currentPageSize, setcurrentPageSize } = props;
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);

  const nodes = results.data?.variants.hits?.edges || [];
  const variants = nodes as VariantEntityNode[];
  const total = results.data?.variants.hits.total || 0;
  const nodesStudies = results?.data?.studies?.hits?.edges || [];
  const studies = nodesStudies.map((n: { node: StudiesResult }) => n.node);

  return (
    <Table
      title={() =>
        total > 0 ? (
          <TableTitle currentPage={currentPageNum} pageSize={currentPageSize} total={total} />
        ) : (
          <></>
        )
      }
      pagination={{
        current: currentPageNum,
        total: total,
        defaultPageSize: currentPageSize,
        onChange: (page, pageSize) => {
          if (currentPageNum !== page || currentPageSize !== pageSize) {
            setCurrentPageNum(page);
            setCurrentPageCb(page);
            setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
          }
        },
        size: 'small',
      }}
      className={style.variantSearchTable}
      loading={results.loading}
      dataSource={makeRows(variants)}
      columns={generateColumns(props, studies)}
      rowClassName={(_, index) => (isEven(index) ? '' : style.rowOdd)}
    />
  );
};

export default connector(VariantTableContainer);
