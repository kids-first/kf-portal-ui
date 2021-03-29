import React, { FC } from 'react';
import style from './ConsequencesCell.module.scss';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import Symbol from './Symbol';
import { toKebabCase } from 'utils';
import { Consequence, Impact } from 'store/graphql/variants/models';

type OwnProps = {
  consequences: Consequence[];
};

export const generateConsequencesDataLines = (rawConsequences: Consequence[]): Consequence[] => {
  // hypothesis: for a given symbol in consequences there MUST be one and only one canonical consequence.
  if (!rawConsequences || rawConsequences.length === 0) {
    return [];
  }
  return rawConsequences.filter((consequence: Consequence) => {
    const isInterGenic = !consequence.node.symbol;
    const isCanonical = consequence.node.canonical;
    return isInterGenic || isCanonical;
  });
};

const impactToColorClassName = Object.freeze({
  [Impact.High]: style.highImpact,
  [Impact.Low]: style.lowImpact,
  [Impact.Moderate]: style.moderateImpact,
  [Impact.Modifier]: style.modifierImpact,
});

const pickImpactColorClassName = (impact: Impact) => impactToColorClassName[impact];

const Bullet = ({ colorClassName = '' }) => (
  <span className={`${style.bullet} ${colorClassName}`} />
);

const ConsequencesCell: FC<OwnProps> = ({ consequences }) => {
  const lines = generateConsequencesDataLines(consequences);
  return (
    <>
      {lines.map((consequence: Consequence, index: number) => {
        /* Note: index can be used as key since the list is readonly */
        const node = consequence.node;
        return (
          <StackLayout center key={index}>
            <Bullet colorClassName={pickImpactColorClassName(node.vep_impact)} />
            {(node.consequences || []).map((c: string, index: number) => (
              <span key={index} className={style.detail}>
                {c}
              </span>
            ))}
            {node.symbol && (
              <Symbol
                key={toKebabCase(node.symbol)}
                symbol={
                  <a
                    className={style.symbolLink}
                    href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${node.symbol}`}
                    target="_blank"
                    rel="noreferrer"
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
