import React, { FunctionComponent } from 'react';
import style from './SearchOption.module.scss';
import { toKebabCase } from 'utils';

export enum Criteria {
  Variant = 'variant',
  GENE = 'gene',
}

type SearchParams = {
  symbols: string[];
  locus: string;
};

const SQUARE_ABBREVIATION = {
  [Criteria.Variant]: { label: 'VR' },
  [Criteria.GENE]: { label: 'GN' },
};

type OwnProps = {
  criteria: Criteria;
  searchParams: SearchParams;
};

const generateSquareColorCss = (criteria: Criteria) => {
  if (criteria === Criteria.Variant) {
    return style.leftSquareBgColorVariant;
  } else if (criteria === Criteria.GENE) {
    return style.leftSquareBgColorGene;
  }
  return style.leftSquareBgColorVariant;
};

const SearchOption: FunctionComponent<OwnProps> = (props) => {
  const { criteria, searchParams } = props;
  const { symbols, locus } = searchParams;
  return (
    <div className={style.container}>
      <div className={`${style.leftSquare} ${generateSquareColorCss(criteria)}`}>
        {SQUARE_ABBREVIATION[criteria].label}
      </div>
      <div className={style.detailsContainer}>
        <div className={style.locus}>{locus}</div>
        <div>
          {symbols.map((symbol: string) => (
            <span key={toKebabCase(symbol)} className={style.symbol}>
              {symbol}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOption;
