import React from 'react';
import { RiseOutlined } from '@ant-design/icons';
import MultiLabel from '@ferlab/ui/core/components/labels/MultiLabel';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Card } from 'antd';

import ParticipantIcon from 'icons/ParticipantIcon';
import StudyIcon from 'icons/StudyIconSvg';
import { VariantEntity } from 'store/graphql/variants/models';
import { toExponentialNotation } from 'utils';

import ClinVarExternalLink from './ClinVarExternalLink';

import styles from './Summary.module.scss';

type SummaryItemProps = {
  field: string;
  value: string;
};

const SummaryItem = ({ field, value }: SummaryItemProps) => (
  <StackLayout className={styles.summaryItem}>
    <Label>{field}</Label>
    <Value>{value}</Value>
  </StackLayout>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.label}>{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.value}>{children}</div>
);

type SummaryProps = {
  variant: VariantEntity | undefined;
};

const Summary = ({ variant }: SummaryProps) => {
  if (!variant) {
    return null;
  }

  return (
    <Card>
      <div className={styles.topContainer}>
        <div>
          <SummaryItem field="Chr" value={variant.chromosome} />
          <SummaryItem field="Start" value={variant.start} />
          <SummaryItem field="Alt. Allele" value={`${variant.alternate}`} />
          <SummaryItem field="Ref. Allele" value={variant.reference} />
        </div>
        <div>
          <StackLayout className={styles.topLeftContainer}>
            <MultiLabel
              Icon={<StudyIcon />}
              subLabel={'Studies'}
              label={variant.studies.hits.total}
            />
            <MultiLabel
              Icon={<ParticipantIcon />}
              subLabel={'Participants'}
              label={variant.participant_number}
            />
            <MultiLabel
              Icon={<RiseOutlined />}
              subLabel={'Frequency'}
              label={toExponentialNotation(variant.participant_frequency)}
            />
          </StackLayout>
          <StackLayout className={styles.buttomLeftContainer}>
            <div>
              <Label>Type</Label>
              <Value>{variant.variant_class}</Value>
            </div>
            <div>
              <Label>Ref Genome</Label>
              <Value>GRCh38</Value>
            </div>
            <div>
              <Label>ClinVar</Label>
              <Value>
                {variant.clinvar?.clinvar_id ? (
                  <ClinVarExternalLink clinvarId={variant.clinvar.clinvar_id} />
                ) : (
                  '-'
                )}
              </Value>
            </div>
            <div>
              <Label>dbSNP</Label>
              <Value>
                {variant.rsnumber ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.ncbi.nlm.nih.gov/snp/${variant.rsnumber}`}
                  >
                    {variant.rsnumber}
                  </a>
                ) : (
                  '-'
                )}
              </Value>
            </div>
          </StackLayout>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
