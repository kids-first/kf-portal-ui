import SuggestionOption from './SuggestionOption';
import React from 'react';
import { GenomicFeatureType, Suggestion } from 'store/graphql/variants/models';

const generateDisplayName = (suggestion: Suggestion): string | undefined => {
  const type = suggestion.type;
  return type === GenomicFeatureType.GENE ? suggestion.geneSymbol : suggestion.locus;
};

const generateSuggestionOptions = (searchText: string | undefined, suggestions: Suggestion[]) => {
  if (!suggestions || suggestions.length === 0) {
    return [];
  }

  return suggestions.map((suggestion: Suggestion): any => {
    const displayName = generateDisplayName(suggestion);
    return {
      label: (
        <SuggestionOption
          type={suggestion.type}
          key={suggestion.suggestion_id}
          matchedText={suggestion.matchedText}
          displayName={displayName || 'unknown'}
        />
      ),
      value: displayName,
      meta: {
        searchText,
        suggestionId: suggestion.suggestion_id,
        featureType: suggestion.type,
        geneSymbol: suggestion.geneSymbol,
      },
    };
  });
};

export default generateSuggestionOptions;
