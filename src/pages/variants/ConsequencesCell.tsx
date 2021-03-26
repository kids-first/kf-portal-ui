import React, { FunctionComponent } from 'react';
import style from './ConsequencesCell.module.scss';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import Symbol from './Symbol';
import { toKebabCase } from 'utils';
import { Consequence, Impact } from 'store/graphql/variants/models';

type OwnProps = {
  consequences: Consequence[];
};

// canonical = true is at the top.
const sortConsequencesByCanonical = (originalConsequences: Consequence[]) =>
  (originalConsequences || []).slice().sort((consequence) => (consequence.node.canonical ? -1 : 1));

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

const ConsequencesCell: FunctionComponent<OwnProps> = ({ consequences }) => {
  const sortedConsequences = sortConsequencesByCanonical(consequences);
  return (
    <>
      {sortedConsequences.map((consequence: Consequence, index: number) => {
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
