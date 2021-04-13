import React from 'react';
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
import style from './VariantsSearchPage.module.scss';
import colors from 'style/themes/default/_colors.scss';

const formatCounts = (num: number) => (num || 0).toLocaleString();

const VariantStatsContainer = () => {
  let result: VariantStatsResults = useStatVariants();

  if (result.loading) {
    return null;
  }

  return (
    <Card
      title={
        <div className={style.variantStatsContainer}>
          <Title level={3}>Data Release 1</Title>
          <div>January 21th, 2021</div>
        </div>
      }
    >
      <StackLayout className={style.variantStatsContainer}>
        <CountWithIcon
          total={formatCounts(result?.stats?.studiesCount)}
          Icon={<StudyIcon fill={colors.iconColor} height={30} width={30} />}
          label={'Studies'}
        />
        <CountWithIcon
          total={formatCounts(result?.stats?.participantsCount)}
          Icon={<ParticipantIcon fill={colors.iconColor} height={30} width={30} />}
          label={'Participants'}
        />
        <CountWithIcon
          total={formatCounts(result.stats.distinctVariantsCount)}
          Icon={<VariantIcon fill={colors.iconColor} height={30} width={30} />}
          label={'Unique Variants'}
        />
        <CountWithIcon
          total={formatCounts(result.stats.occurrencesCount)}
          Icon={<OccurencesIcon fill={colors.iconColor} height={30} width={30} />}
          label={'Occurences'}
        />
      </StackLayout>
    </Card>
  );
};

export default VariantStatsContainer;
