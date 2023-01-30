import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IArrangerEdge } from '@ferlab/ui/core/graphql/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { IConsequenceEntity, Impact } from 'graphql/variants/models';

import HighBadgeIcon from 'components/Icons/VariantBadgeIcons/HighBadgeIcon';
import LowBadgeIcon from 'components/Icons/VariantBadgeIcons/LowBadgeIcon';
import ModerateBadgeIcon from 'components/Icons/VariantBadgeIcons/ModerateBadgeIcon';
import ModifierBadgeIcon from 'components/Icons/VariantBadgeIcons/ModifierBadgeIcon';
import { toKebabCase } from 'utils/helper';

import { generateConsequencesDataLines } from './consequences';

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
}: {
  consequences: IArrangerEdge<IConsequenceEntity>[];
}) => {
  const lines = generateConsequencesDataLines(consequences);
  return (
    <>
      {lines.map((consequence, index) => {
        /* Note: index can be used as key since the list is readonly */
        const node = consequence.node;

        if (node.consequences) {
          return (
            <StackLayout className={style.stackLayout} center key={index}>
              {pickImpactBadge(node.vep_impact)}
              <span key={index} className={style.detail}>
                {removeUnderscoreAndCapitalize(node.consequences[0])}
              </span>
              {node.symbol && (
                <span key={toKebabCase(node.symbol)} className={style.symbol}>
                  <ExternalLink
                    href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${node.symbol}`}
                  >
                    {node.symbol}
                  </ExternalLink>
                </span>
              )}
              {node.hgvsp && <span>{node.hgvsp.split(':')[1]}</span>}
            </StackLayout>
          );
        }

        return null;
      })}
    </>
  );
};

export default ConsequencesCell;
