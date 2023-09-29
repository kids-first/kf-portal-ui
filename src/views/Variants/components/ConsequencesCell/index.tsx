import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IArrangerEdge } from '@ferlab/ui/core/graphql/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { IConsequenceEntity, Impact } from '../../../../graphql/variants/models';

import HighBadgeIcon from 'components/Icons/VariantBadgeIcons/HighBadgeIcon';
import LowBadgeIcon from 'components/Icons/VariantBadgeIcons/LowBadgeIcon';
import ModerateBadgeIcon from 'components/Icons/VariantBadgeIcons/ModerateBadgeIcon';
import ModifierBadgeIcon from 'components/Icons/VariantBadgeIcons/ModifierBadgeIcon';
import { toKebabCase } from 'utils/helper';

import style from './index.module.scss';

const impactToColorClassName = Object.freeze({
  [Impact.High]: <HighBadgeIcon svgClass={`${style.bullet} ${style.highImpact}`} />,
  [Impact.Low]: <LowBadgeIcon svgClass={`${style.bullet} ${style.lowImpact}`} />,
  [Impact.Moderate]: <ModerateBadgeIcon svgClass={`${style.bullet} ${style.moderateImpact}`} />,
  [Impact.Modifier]: <ModifierBadgeIcon svgClass={`${style.bullet} ${style.modifierImpact}`} />,
});

const pickImpactBadge = (impact: Impact) => impactToColorClassName[impact];

const ConsequencesCell = ({
  consequences,
  symbol,
}: {
  consequences: IArrangerEdge<IConsequenceEntity>[];
  symbol: string;
}) => {
  const pickedEdge = consequences.find((c) => c.node.picked);
  if (!pickedEdge) {
    //must never happen
    return null;
  }

  const picked = pickedEdge?.node;
  if (!picked?.consequence) {
    return null;
  }

  return (
    <StackLayout className={style.stackLayout} center key={'1'}>
      {pickImpactBadge(picked.vep_impact)}
      <span key="detail" className={style.detail}>
        {removeUnderscoreAndCapitalize(picked.consequence[0])}
      </span>
      {symbol && (
        <span key={toKebabCase(symbol)} className={style.symbol}>
          <ExternalLink href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${symbol}`}>
            {symbol}
          </ExternalLink>
        </span>
      )}
      {picked.hgvsp && <span>{picked.hgvsp.split(':')[1]}</span>}
    </StackLayout>
  );
};

export default ConsequencesCell;
