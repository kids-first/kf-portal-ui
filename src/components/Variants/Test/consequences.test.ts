import { generateConsequencesDataLines, filterThanSortConsequencesByImpact } from '../consequences';

describe('Consequences', () => {
  describe('sortConsequences', () => {});
  it('should sort correctly (desc impact and canonical comes first)', () => {
    const generalCase = [
      {
        node: { biotype: 'protein_coding', impact_score: 4, canonical: true },
      },
      {
        node: { biotype: 'retained_intron', impact_score: 4, canonical: false },
      },
      {
        node: { biotype: 'protein_coding', impact_score: 2, canonical: true },
      },
      {
        node: { biotype: 'protein_coding', impact_score: 2, canonical: false },
      },
      {
        node: { biotype: 'protein_coding', impact_score: 1, canonical: false },
      },
    ];
    // @ts-ignore only needed data.
    expect(filterThanSortConsequencesByImpact(generalCase)).toEqual([
      {
        node: {
          biotype: 'protein_coding',
          canonical: true,
          impact_score: 4,
        },
      },
      {
        node: {
          biotype: 'retained_intron',
          canonical: false,
          impact_score: 4,
        },
      },
      {
        node: {
          biotype: 'protein_coding',
          canonical: true,
          impact_score: 2,
        },
      },
      {
        node: {
          biotype: 'protein_coding',
          canonical: false,
          impact_score: 2,
        },
      },
      {
        node: {
          biotype: 'protein_coding',
          canonical: false,
          impact_score: 1,
        },
      },
    ]);
  });

  describe('generateConsequencesDataLines', () => {
    it('should handle trivial cases ', () => {
      const degenerateCase = null;
      expect(generateConsequencesDataLines(degenerateCase)).toEqual([]);
      const trivialCase = [
        {
          node: {
            impact_score: 1,
            canonical: false,
          },
        },
      ];

      // @ts-ignore only needed data.
      expect(generateConsequencesDataLines(trivialCase)).toEqual([
        {
          node: {
            impact_score: 1,
            canonical: false,
          },
        },
      ]);
    });

    it(
      'should generate one line of data for each symbol' +
        'with priority for canonical when scores are equal',
      () => {
        const case1Canonical = [
          {
            node: { symbol: 'PALB2', impact_score: 1, canonical: true },
          },
          {
            node: { symbol: 'PALB2', impact_score: 1, canonical: false },
          },
          {
            node: { symbol: 'PALB2', impact_score: 1, canonical: false },
          },
          {
            node: { symbol: 'AC008870.4', impact_score: 1, canonical: true },
          },
        ];

        // @ts-ignore only needed data.
        expect(generateConsequencesDataLines(case1Canonical)).toEqual([
          {
            node: {
              canonical: true,
              impact_score: 1,
              symbol: 'PALB2',
            },
          },
          {
            node: {
              canonical: true,
              impact_score: 1,
              symbol: 'AC008870.4',
            },
          },
        ]);
      },
    );
    it(
      'should generate one line of data for each symbol' +
        'with priority for highest score over canonical',
      () => {
        const case2NoCanonical = [
          {
            node: { symbol: 'PALB2', impact_score: 5, canonical: false },
          },
          {
            node: { symbol: 'PALB2', impact_score: 1, canonical: false },
          },
          {
            node: { symbol: 'PALB2', impact_score: 1, canonical: false },
          },
          {
            node: { symbol: 'AC008870.4', impact_score: 1, canonical: false },
          },
        ];

        // @ts-ignore only needed data.
        expect(generateConsequencesDataLines(case2NoCanonical)).toEqual([
          {
            node: {
              canonical: false,
              impact_score: 5,
              symbol: 'PALB2',
            },
          },
          {
            node: {
              canonical: false,
              impact_score: 1,
              symbol: 'AC008870.4',
            },
          },
        ]);
      },
    );

    it('should generate pick first consequence when all is equal', () => {
      const case2NoCanonical = [
        {
          node: {
            symbol: 'PALB2',
            impact_score: 1,
            canonical: false,
            biotype: 'nonsense_mediated_decay',
          },
        },
        {
          node: {
            symbol: 'PALB2',
            impact_score: 1,
            canonical: false,
            biotype: 'retained_intron',
          },
        },
        {
          node: { symbol: 'PALB2', impact_score: 1, canonical: false },
        },
        {
          node: { symbol: 'AC008870.4', impact_score: 1, canonical: false },
        },
      ];

      // @ts-ignore only needed data.
      expect(generateConsequencesDataLines(case2NoCanonical)).toEqual([
        {
          node: {
            canonical: false,
            impact_score: 1,
            symbol: 'PALB2',
            biotype: 'nonsense_mediated_decay',
          },
        },
        {
          node: {
            canonical: false,
            impact_score: 1,
            symbol: 'AC008870.4',
          },
        },
      ]);
    });
  });
});
