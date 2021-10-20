import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import { generateConsequencesDataLines } from 'components/Variants/consequences';
import HighBadgeIcon from 'icons/variantBadgeIcons/HighBadgeIcon';
import LowBadgeIcon from 'icons/variantBadgeIcons/LowBadgeIcon';
import ModerateBadgeIcon from 'icons/variantBadgeIcons/ModerateBadgeIcon';
import ModifierBadgeIcon from 'icons/variantBadgeIcons/ModifierBadgeIcon';
import { Consequence, Impact } from 'store/graphql/variants/models';
import { toKebabCase } from 'utils';

import Symbol from './Symbol';

import style from './ConsequencesCell.module.scss';

type OwnProps = {
  consequences: Consequence[];
};

const impactToColorClassName = Object.freeze({
  [Impact.High]: <HighBadgeIcon svgClass={`${style.bullet} ${style.highImpact}`} />,
  [Impact.Low]: <LowBadgeIcon svgClass={`${style.bullet} ${style.lowImpact}`} />,
  [Impact.Moderate]: <ModerateBadgeIcon svgClass={`${style.bullet} ${style.moderateImpact}`} />,
  [Impact.Modifier]: <ModifierBadgeIcon svgClass={`${style.bullet} ${style.modifierImpact}`} />,
});

const pickImpacBadge = (impact: Impact) => impactToColorClassName[impact];

const ConsequencesCell = ({ consequences }: OwnProps) => {
  const lines = generateConsequencesDataLines(consequences);
  return (
    <>
      {lines.map((consequence: Consequence, index: number) => {
        /* Note: index can be used as key since the list is readonly */
        const node = consequence.node;
        return (
          <StackLayout center key={index}>
            {pickImpacBadge(node.vep_impact)}
            <span key={index} className={style.detail}>
              {node.consequences[0]}
            </span>
            {node.symbol && (
              <Symbol
                key={toKebabCase(node.symbol)}
                symbol={
                  <a
                    className={style.symbolLink}
                    href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${node.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {node.symbol}
                  </a>
                }
              />
            )}
            {node.aa_change && <span>{node.aa_change}</span>}
          </StackLayout>
        );
      })}
    </>
  );
};

export default ConsequencesCell;
