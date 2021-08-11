import React from 'react';
import MultiLabel from '@ferlab/ui/core/components/labels/MultiLabel';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Card } from 'antd';
import Title from 'antd/es/typography/Title';

import OccurencesIcon from 'icons/OccurencesIcon';
import ParticipantIcon from 'icons/ParticipantIcon';
import StudyIcon from 'icons/StudyIcon';
import VariantIcon from 'icons/VariantIcon';
import { VariantStatsResults } from 'store/graphql/variants/models';
import { useStatVariants } from 'store/graphql/variants/statsActions';

import style from './VariantsSearchPage.module.scss';

const formatCounts = (num: number) => (num || 0).toLocaleString();
const iconSize = { height: 30, width: 30 };

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
        <MultiLabel
          label={formatCounts(result?.stats?.studiesCount)}
          Icon={<StudyIcon className={style.variantPageIconColor} {...iconSize} />}
          subLabel={'Studies'}
        />
        <MultiLabel
          label={formatCounts(result?.stats?.participantsCount)}
          Icon={<ParticipantIcon className={style.variantPageIconColor} {...iconSize} />}
          subLabel={'Participants'}
        />
        <MultiLabel
          label={formatCounts(result.stats.distinctVariantsCount)}
          Icon={<VariantIcon className={style.variantPageIconColor} {...iconSize} />}
          subLabel={'Unique Variants'}
        />
        <MultiLabel
          label={formatCounts(result.stats.occurrencesCount)}
          Icon={<OccurencesIcon className={style.variantPageIconColor} {...iconSize} />}
          subLabel={'Occurences'}
        />
      </StackLayout>
    </Card>
  );
};

export default VariantStatsContainer;
