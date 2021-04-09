import React, { FC } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import CountWithIcon from '@ferlab/ui/core/components/labels/CountWithIcon';
import Title from 'antd/es/typography/Title';
import { useStatVariants } from 'store/graphql/variants/statsActions';
import { VariantStatsResults } from 'store/graphql/variants/models';
import StudyIcon from 'icons/StudyIcon';
import ParticipantIcon from 'icons/ParticipantIcon';
import VariantIcon from 'icons/VariantIcon';
import OccurencesIcon from 'icons/OccurencesIcon';
import { Card } from 'antd';

const VariantStatsContainer: FC = () => {
  let result: VariantStatsResults = useStatVariants();

  if (result.loading) {
    return null;
  }

  return (
    <Card
      title={
        <div className={'variant-page-flex variant-page-space-between'}>
          <Title level={3}>Data Release 1</Title>
          <div>April 08th, 2021</div>
        </div>
      }
    >
      <StackLayout className={'variant-page-space-between'}>
        <CountWithIcon
          total={result.stats.studiesCount}
          Icon={
            <StudyIcon className={'variant-page-icons'} fill={'#383f72'} height={30} width={30} />
          }
          label={'Studies'}
        />
        <CountWithIcon
          total={result.stats.participantsCount}
          Icon={<ParticipantIcon fill={'#383f72'} height={30} width={30} />}
          label={'Participants'}
        />
        <CountWithIcon
          total={result.stats.distinctVariantsCount}
          Icon={<VariantIcon fill={'#383f72'} height={30} width={30} />}
          label={'Unique Variants'}
        />
        <CountWithIcon
          total={result.stats.occurrencesCount}
          Icon={<OccurencesIcon fill={'#383f72'} height={30} width={30} />}
          label={'Occurences'}
        />
      </StackLayout>
    </Card>
  );
};

export default VariantStatsContainer;
