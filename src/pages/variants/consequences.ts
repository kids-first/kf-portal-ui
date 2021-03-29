import { Consequence } from 'store/graphql/variants/models';

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