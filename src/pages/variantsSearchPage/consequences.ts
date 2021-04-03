import { Consequence } from 'store/graphql/variants/models';

const keyNoSymbol = 'noSymbol_';

const findHighestImpactConsequenceWithSymbol = (consequences: Consequence[]) =>
  consequences.reduce((consequenceWithHighestScore, currentConsequence) => {
    const currentScore = currentConsequence.node?.impact_score || 0;
    const highestScoreFoundSoFar = consequenceWithHighestScore.node?.impact_score || 0;
    const currentConsequenceWins = currentScore > highestScoreFoundSoFar;
    if (currentConsequenceWins) {
      return { ...currentConsequence };
    }
    return { ...consequenceWithHighestScore };
  }, consequences[0]);

/*
 * Algorithm:
 *   Input: consequences
 *   #=====#
 *   - IF consequence has NO gene (symbol) then keep it;
 *   - IF consequence has a symbol filter accordingly to these rules:
 *      for a given symbol,
 *        IF
 *          a canonical consequence exists keep it and discard the others (assumes there is only one as such);
 *        ELSE
 *          find the consequence that as the highest "impact_score"(If scores are all equal, take the first one at hand);
 *   #=====#
 *   Output: filtered consequences.
 * */

type SymbolToConsequences = { [key: string]: Consequence[] };

export const generateConsequencesDataLines = (rawConsequences: Consequence[]): Consequence[] => {
  if (!rawConsequences || rawConsequences.length === 0) {
    return [];
  }

  const symbolToConsequences: SymbolToConsequences = rawConsequences.reduce<SymbolToConsequences>(
    (dict: SymbolToConsequences, consequence: Consequence) => {
      const keyForCurrentConsequence = consequence.node?.symbol || keyNoSymbol;
      const oldConsequences = dict[keyForCurrentConsequence] || [];
      return { ...dict, [keyForCurrentConsequence]: [...oldConsequences, { ...consequence }] };
    },
    {},
  );

  return Object.entries(symbolToConsequences).reduce((acc: Consequence[], [key, consequences]) => {
    if (key === keyNoSymbol) {
      return [...acc, ...consequences];
    }

    const canonicalConsequence = consequences.find(
      (consequence: Consequence) => consequence.node.canonical,
    );
    if (canonicalConsequence) {
      return [...acc, { ...canonicalConsequence }];
    }

    return [...acc, { ...findHighestImpactConsequenceWithSymbol(consequences) }];
  }, []);
};
