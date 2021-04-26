import React from 'react';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import { addToSqons } from '../../common/sqonUtils';
import style from '../variantsSearchPage/VariantTable.module.scss';
import { Study } from 'store/graphql/variants/models';
import { Sqon } from 'store/sqon';
import { formatQuotientOrElse, formatQuotientToExponentialOrElse } from 'utils';
import { AlignmentOptions } from 'ui/TableOptions';

type EnhancedVariantStudy = Study & { participantTotalNumber: number };

type OwnProps = {
  variantStudies: EnhancedVariantStudy[];
  onClickStudyLink: (sqons: Sqon[]) => void;
  currentVirtualStudy: Sqon[];
  participantNumber: number;
  altAlleles: number | undefined;
  homozygotes: number | undefined;
  participantTotalNumber: number | undefined;
};

const MIN_N_OF_PARTICIPANTS_FOR_LINK = 10;

const TableSummaryKfStudies = (props: OwnProps) => {
  const {
    variantStudies,
    onClickStudyLink,
    currentVirtualStudy,
    participantNumber,
    altAlleles,
    homozygotes,
    participantTotalNumber,
  } = props;
  const hasParticipantLink: boolean = variantStudies.some(
    (s: Study) => s.participant_number >= MIN_N_OF_PARTICIPANTS_FOR_LINK,
  );

  const allParticipants: string[] = [
    ...variantStudies.map((s: EnhancedVariantStudy) => s.participant_ids || []),
  ].flat();

  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
      <Table.Summary.Cell index={1}>{''}</Table.Summary.Cell>
      <Table.Summary.Cell index={2}>
        {hasParticipantLink ? (
          <>
            <Link
              to={'/explore'}
              href={'#top'}
              onClick={() => {
                onClickStudyLink(
                  addToSqons({
                    fieldsWValues: [{ field: 'kf_id', value: allParticipants }],
                    sqons: currentVirtualStudy,
                  }),
                );
                const toTop = document.getElementById('main-page-container');
                toTop?.scrollTo(0, 0);
              }}
            >
              <Button type="link">
                <div className={style.variantTableLink}>{participantNumber}</div>
              </Button>
            </Link>
            {participantTotalNumber ? ` / ${participantTotalNumber}` : ''}
          </>
        ) : (
          formatQuotientOrElse(participantNumber, participantTotalNumber)
        )}
      </Table.Summary.Cell>
      <Table.Summary.Cell align={AlignmentOptions.center} index={3}>
        {formatQuotientToExponentialOrElse(participantNumber, participantTotalNumber)}
      </Table.Summary.Cell>
      <Table.Summary.Cell align={AlignmentOptions.center} index={4}>
        {altAlleles}
      </Table.Summary.Cell>
      <Table.Summary.Cell align={AlignmentOptions.center} index={5}>
        {homozygotes}
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
};

export default TableSummaryKfStudies;
