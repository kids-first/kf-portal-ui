import React, { FunctionComponent } from 'react';
import style from './SuggestionOption.module.scss';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { SearchText } from 'store/genomicSuggesterTypes';
import { GenomicFeatureType } from 'store/genomicSuggesterTypes';

const SQUARE_ABBREVIATION = {
  [GenomicFeatureType.Variant]: { label: 'VR' },
  [GenomicFeatureType.GENE]: { label: 'GN' },
};

type OwnProps = {
  matchedText: SearchText;
  displayName: string;
  type: GenomicFeatureType;
};

const generateSquareColorCss = (genomicFeatureType: GenomicFeatureType) => {
  if (genomicFeatureType === GenomicFeatureType.Variant) {
    return style.leftSquareBgColorVariant;
  } else if (genomicFeatureType === GenomicFeatureType.GENE) {
    return style.leftSquareBgColorGene;
  }
  return style.leftSquareBgColorVariant;
};

const SuggestionOption: FunctionComponent<OwnProps> = (props) => {
  const { displayName, type, matchedText } = props;
  return (
    <StackLayout>
      <div className={`${style.leftSquare} ${generateSquareColorCss(type)}`}>
        {SQUARE_ABBREVIATION[type].label}
      </div>
      <StackLayout vertical className={style.detailsContainer}>
        <div className={style.displayName}>{displayName}</div>
        <div>{matchedText}</div>
      </StackLayout>
    </StackLayout>
  );
};

export default SuggestionOption;
