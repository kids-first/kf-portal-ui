import React, { FunctionComponent } from 'react';
import style from './ConsequencesCell.module.scss';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import Symbol from './Symbol';
import { toKebabCase } from 'utils';

enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

type Consequence = {
  symbols: string[];
  consequences: string[];
  impact: Impact;
  canonical: boolean;
  [key: string]: any;
};

type OwnProps = {
  consequences: Consequence[];
};

// canonical = true is at the top.
const sortConsequencesByCanonical = (originalConsequences: Consequence[]) =>
  (originalConsequences || []).sort((consequence) => (consequence.canonical ? -1 : 1));

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
      {sortedConsequences.map((consequence: Consequence, index: number) => (
        /* Note: index can be used as key since the list is readonly */
        <StackLayout center key={index}>
          <Bullet colorClassName={pickImpactColorClassName(consequence.impact)} />
          {(consequence.consequences || []).map((c: string, index: number) => (
            <span key={index} className={style.detail}>
              {c}
            </span>
          ))}
          {(consequence.symbols || []).map((symbol: string) => (
            <Symbol
              key={toKebabCase(symbol)}
              symbol={
                <a
                  className={style.symbolLink}
                  href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${symbol}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {symbol}
                </a>
              }
            />
          ))}
        </StackLayout>
      ))}
    </>
  );
};

export default ConsequencesCell;
