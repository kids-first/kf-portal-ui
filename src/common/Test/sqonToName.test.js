import { expect } from 'chai';
import { cyan } from 'chalk';
import filtersToName from 'common/sqonToName';

describe(cyan.bold('sqonToName'), () => {
  describe('filtersToName', () => {
    it('returns default name', () => {
      const sqon = {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'observed_phenotype.name',
              value: ['Abnormal heart morphology (HP:0001627)'],
            },
          },
        ],
      };

      expect(filtersToName({ filters: sqon })).equal('Abnormal heart morphology (HP:0001627)');
    });
  });
});
