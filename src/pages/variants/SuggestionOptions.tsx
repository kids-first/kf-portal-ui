import { Suggestion } from 'store/genomicSuggesterTypes';
import SuggestionOption from './SuggestionOption';
import React from 'react';
import { GenomicFeatureType } from 'store/genomicSuggesterTypes';

const generateDisplayName = (suggestion: Suggestion): string => {
  const type = suggestion.type;
  if (type === GenomicFeatureType.Variant) {
    return suggestion.locus || '';
  } else if (type === GenomicFeatureType.GENE) {
    return suggestion.suggestion_id; // gene symbol.
  }
  return '';
};

const generateSuggestionOptions = (searchText: string | undefined, suggestions: Suggestion[]) => {
  if (!suggestions || suggestions.length === 0) {
    return [];
  }

  return suggestions.map((suggestion: Suggestion) => {
    const displayName = generateDisplayName(suggestion);
    return {
      label: (
        <SuggestionOption
          type={suggestion.type}
          key={suggestion.suggestion_id}
          matchedText={suggestion.matchedText}
          displayName={displayName}
        />
      ),
      value: displayName,
      info: {
        searchText,
        suggestionId: suggestion.suggestion_id,
        featureType: suggestion.type,
      },
    };
  });
};

export default generateSuggestionOptions;
