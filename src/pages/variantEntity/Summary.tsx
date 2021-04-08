import React from 'react';

import './Summary.css';
import CountWithIcon from '@ferlab/ui/core/components/labels/CountWithIcon';
import StudyIcon from 'icons/StudyIconSvg';
import ParticipantIcon from 'icons/ParticipantIcon';
import { RiseOutlined } from '@ant-design/icons';

import { VariantEntity } from 'store/graphql/variants/models';
import { Card } from 'antd';

type SummaryProps = {
  variant: VariantEntity | undefined;
};

const SummaryItem = (field: string, value: string) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '25%' }}>{field}</div>
      <div style={{ width: '75%' }}>{value}</div>
    </div>
  );
};

const Summary = ({ variant }: SummaryProps) => {
  if (!variant) {
    return null;
  }

  return (
    <Card>
      <div className={'grid-top-container'}>
        <div className={'grid-top-container-item'}>
          {SummaryItem('Chr', variant.chromosome)}
          {SummaryItem('Start', variant.start)}
          {SummaryItem('Allele Alt.', variant.start)}
          {SummaryItem('Allele Réf.', variant.reference)}
        </div>
        <div className={'grid-top-container-item'}>
          <div className={'grid-top-container-item'}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <CountWithIcon
                Icon={<StudyIcon className={'query-builder-icon'} />}
                label={'Studies'}
                total={variant.studies.hits.total}
              />
              <CountWithIcon
                Icon={<ParticipantIcon className={'query-builder-icon'} />}
                label={'Participants'}
                total={variant.participant_number}
              />
              <CountWithIcon
                Icon={<RiseOutlined className={'query-builder-icon'} />}
                label={'Participants'}
                total={variant.frequencies.internal.combined.af.toExponential(2)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>Type</div>
                <div>{variant.variant_class}</div>
              </div>
              <div>
                <div>Genome Ref.</div>
                <div>GRCh38</div>
              </div>
              <div>
                <div>ClinVar</div>
                <div>{variant.clinvar?.clinvar_id || '-'}</div>
              </div>
              <div>
                <div>dbSNP</div>
                <div>{variant.rsnumber || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
