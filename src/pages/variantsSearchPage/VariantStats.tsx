import React from 'react';
import MultiLabel from '@ferlab/ui/core/components/labels/MultiLabel';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Spin } from 'antd';

import LineStyleIcon from 'icons/LineStyleIcon';
import OccurencesIcon from 'icons/OccurencesIcon';
import ParticipantIcon from 'icons/ParticipantIcon';
import StudyIcon from 'icons/StudyIcon';
import { VariantStatsResults } from 'store/graphql/variants/models';
import { useStatVariants } from 'store/graphql/variants/statsActions';
import styleThemeColors from 'style/themes/default/colors.module.scss';

import style from './VariantsSearchPage.module.scss';

const formatCounts = (num: number) => (num || 0).toLocaleString();
const iconSize = { height: 30, width: 30 };

const VariantStatsContainer = () => {
  let result: VariantStatsResults = useStatVariants();

  return (
    <Spin spinning={result.loading}>
      <StackLayout className={style.variantStatsContainer}>
        <MultiLabel
          label={formatCounts(result?.stats?.studiesCount)}
          Icon={<StudyIcon className={style.variantPageIconColor} {...iconSize} />}
          className={style.variantStatsLabel}
          subLabel={'Studies'}
        />
        <MultiLabel
          label={formatCounts(result?.stats?.participantsCount)}
          Icon={<ParticipantIcon className={style.variantPageIconColor} {...iconSize} />}
          className={style.variantStatsLabel}
          subLabel={'Participants'}
        />
        <MultiLabel
          label={formatCounts(result?.stats?.distinctVariantsCount)}
          Icon={<LineStyleIcon fill={styleThemeColors.iconColor} width={'32px'} height={'32px'} />}
          className={style.variantStatsLabel}
          subLabel={'Unique Variants'}
        />
        <MultiLabel
          label={formatCounts(result?.stats?.occurrencesCount)}
          Icon={<OccurencesIcon className={style.variantPageIconColor} {...iconSize} />}
          className={style.variantStatsLabel}
          subLabel={'Occurences'}
        />
      </StackLayout>
    </Spin>
  );
};

export default VariantStatsContainer;
