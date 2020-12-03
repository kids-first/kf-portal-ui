import { expect } from 'chai';
import cloneDeep from 'lodash/cloneDeep';
import { cyan } from 'chalk';

import {
  getDefaultSqon,
  isDefaultSqon,
  setSqonValueAtIndex,
  createNewQueryFromSetId,
  addSetToActiveQuery,
  MERGE_VALUES_STRATEGIES,
  MERGE_OPERATOR_STRATEGIES,
  addFieldToActiveQuery,
} from '../sqonUtils';

const numberOfSqonsDidntChanged = (sourceSqons, sqonIndex, newSqons) => {
  expect(newSqons[sqonIndex].content.length).to.equal(sourceSqons[sqonIndex].content.length);
};

describe(cyan.bold('sqonUtils'), () => {
  describe('getDefaultSqon', () => {
    it('returns an empty sqon', () => {
      const sqon = getDefaultSqon();
      expect(sqon.length).to.eq(1);
      expect(sqon[0].op).to.eq('and');
      expect(sqon[0].content).to.eql([]);
    });

    it('returns a new instance each time', () => {
      const sqon1 = getDefaultSqon();
      const sqon2 = getDefaultSqon();
      expect(sqon1).not.to.be.eq(sqon2);
      expect(sqon1).to.be.eql(sqon2);
    });
  });

  describe('isDefaultSqon', () => {
    it('returns `true` if a sqon is loosely equal to the default sqon', () => {
      expect(isDefaultSqon([{ op: 'and', content: [] }])).to.be.true;
    });

    it('returns `false` if a sqon is not loosely equal to the default sqon', () => {
      expect(isDefaultSqon([{ op: 'or', content: [] }])).to.be.false;
      expect(isDefaultSqon([{ op: 'and', content: [0] }])).to.be.false;
    });
  });

  describe('setSqonValueAtIndex', () => {
    describe('given an empty sqon in "targetSqons" at the given "targetIndex"', () => {
      const targetIndex = 0;
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = getDefaultSqon();
      });

      it('adds the operation of the "newSqon" in the "targetSqons"', () => {
        const newSqon = {
          op: '<=',
          content: { field: 'fieldName', value: [123] },
        };

        const resultingSqons = setSqonValueAtIndex(sourceSqons, targetIndex, newSqon);

        const resultingSqon = resultingSqons[targetIndex];
        expect(resultingSqon.content.length).to.equal(1);

        const appendedOperation = resultingSqon.content[0];
        expect(appendedOperation.op).to.equal('<=');
        expect(appendedOperation.content.field).to.equal('fieldName');
        expect(appendedOperation.content.value).to.deep.equal([123]);
      });

      it('does not mutates the "targetSqons" parameter', () => {
        const sqonsClone = cloneDeep(sourceSqons);

        setSqonValueAtIndex(sourceSqons, targetIndex, {
          op: 'in',
          content: { field: 'meow', value: [1, 2, 3] },
        });

        expect(sqonsClone).be.deep.equal(sourceSqons);
      });

      it('throws if no operator is provided and the field is not found', () => {
        expect(() => {
          setSqonValueAtIndex(sourceSqons, targetIndex, {
            content: { field: 'friends', value: ['snap', 'crackle', 'pop'] },
          });
        }).to.throw(
          'Cannot add the field "friends" to the sqons:' +
            ' no operator provided and no matching field found in sqons',
        );
      });
    });

    describe('given that the "field" exists in "targetSqons" at the given "targetIndex"', () => {
      const sqonIndex = 0;
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'pets', value: ['cats', 'dogs'] } },
              { op: 'in', content: { field: 'names', value: ['Bob'] } },
              { op: '<=', content: { field: 'age', value: [5] } },
            ],
          },
        ];
      });

      it('replaces the value of the field', () => {
        const newSqon = {
          op: 'in',
          content: { field: 'names', value: ['Robert Paulson'] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon);

        numberOfSqonsDidntChanged(sourceSqons, sqonIndex, sqons);
        expect(sqons[sqonIndex].content[1].content.value).to.be.deep.equal(['Robert Paulson']);
      });

      it('replaces the operator', () => {
        const newSqon = {
          op: '>',
          content: { field: 'age', value: [55] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon);

        numberOfSqonsDidntChanged(sourceSqons, sqonIndex, sqons);
        expect(sqons[sqonIndex].content[2].op).to.be.deep.equal(newSqon.op);
      });

      it('does not set the operator if none is provided in newSqon', () => {
        const newSqon = {
          content: { field: 'age', value: [75] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon);

        numberOfSqonsDidntChanged(sourceSqons, sqonIndex, sqons);
        expect(sqons[sqonIndex].content[2].op).to.be.deep.equal('<=');
      });

      describe('given that options are provided', () => {
        it('overrides the value if the "values" is not provided (default)', () => {
          const newSqon = {
            op: 'in',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            // `opts` provided, but not `values`
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['birds', 'cats'],
            },
          });
        });

        it('overrides the value if the "values" is "OVERRIDE_VALUES"', () => {
          const newSqon = {
            op: 'in',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            values: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['birds', 'cats'],
            },
          });
        });

        it('merge the value if the "values" is "APPEND_VALUES"', () => {
          const newSqon = {
            op: 'in',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['cats', 'dogs', 'birds'],
            },
          });
        });

        it('replaces the operator if the "operator" is not provided (default)', () => {
          const newSqon = {
            op: 'not',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            // `opts` provided, but not `operator`
          });

          expect(sqons[sqonIndex].content[0].op).to.be.deep.equal('not');
        });

        it('replaces the operator if the "operator" is "OVERRIDE_OPERATOR"', () => {
          const newSqon = {
            op: 'not',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
          });

          expect(sqons[sqonIndex].content[0].op).to.be.deep.equal('not');
        });

        it('keep the operator in the if the "operator" is "KEEP_OPERATOR"', () => {
          const newSqon = {
            op: 'not',
            content: { field: 'pets', value: ['birds', 'cats'] },
          };

          const sqons = setSqonValueAtIndex(sourceSqons, sqonIndex, newSqon, {
            operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
          });

          expect(sqons[sqonIndex].content[0]).to.be.deep.equal({
            op: 'in',
            content: {
              field: 'pets',
              value: ['birds', 'cats'],
            },
          });
        });
      });
    });

    describe('given that there is a reference in the sqons', () => {
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [
          {
            op: 'and',
            content: { op: 'in', content: { field: 'job', value: ['developer'] } },
          },
          {
            op: 'and',
            content: [
              0,
              {
                op: 'in',
                content: { field: 'names', value: ['Bob'] },
              },
            ],
          },
        ];
      });

      it('does not resolves references', () => {
        const newSqon = {
          op: 'in',
          content: { field: 'job', value: ['devop', 'firemen'] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, 1, newSqon);

        expect(sqons[1].content[2]).to.be.deep.equal(newSqon);
      });
    });

    describe('given a deeply nested sqon', () => {
      let sourceSqons;

      beforeEach(() => {
        sourceSqons = [
          {
            op: 'and',
            content: [
              {
                op: 'or',
                content: [
                  { op: 'in', content: { field: 'names', value: ['Bob'] } },
                  { op: '<', content: { field: 'age', value: [10] } },
                  { op: 'in', content: { field: 'pets', value: ['cat', 'lizard'] } },
                ],
              },
            ],
          },
        ];
      });

      it('still find and edits the field', () => {
        const newSqon = {
          op: '>',
          content: { field: 'age', value: [25] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, 0, newSqon);

        expect(sqons).to.deep.equal([
          {
            op: 'and',
            content: [
              {
                op: 'or',
                content: [
                  { op: 'in', content: { field: 'names', value: ['Bob'] } },
                  { op: '>', content: { field: 'age', value: [25] } },
                  { op: 'in', content: { field: 'pets', value: ['cat', 'lizard'] } },
                ],
              },
            ],
          },
        ]);
      });

      it('append the new sqon to the root level if not found', () => {
        const newSqon = {
          op: 'in',
          content: { field: 'lucky number', value: [713105] },
        };

        const sqons = setSqonValueAtIndex(sourceSqons, 0, newSqon);

        expect(sqons).to.deep.equal([
          {
            op: 'and',
            content: [
              {
                op: 'or',
                content: [
                  { op: 'in', content: { field: 'names', value: ['Bob'] } },
                  { op: '<', content: { field: 'age', value: [10] } },
                  { op: 'in', content: { field: 'pets', value: ['cat', 'lizard'] } },
                ],
              },
              {
                op: 'in',
                content: { field: 'lucky number', value: [713105] },
              },
            ],
          },
        ]);
      });
    });

    describe('given query sqons and a set id', () => {
      it('should create an empty sqon (createNewQueryFromSetId)', () => {
        const initialQuery = [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73'] },
              },
            ],
          },
        ];
        const sqons = createNewQueryFromSetId('086e54f6-1f6c-42e4-a1ac-436a50b57d22', initialQuery);

        expect(sqons).to.be.deep.equal([
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:086e54f6-1f6c-42e4-a1ac-436a50b57d22'] },
              },
            ],
          },
        ]);
      });

      it('should add a set to another set (addSetToActiveQuery)', () => {
        const initialQuery = [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73'] },
              },
            ],
          },
        ];
        const sqons = addSetToActiveQuery({
          setId: 'ed821267-8ff9-4f4d-a811-950f0ad8d5b6',
          querySqons: initialQuery,
          activeIndex: 2,
        });

        expect(sqons).to.be.deep.equal([
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'kf_id',
                  value: [
                    'set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73',
                    'set_id:ed821267-8ff9-4f4d-a811-950f0ad8d5b6',
                  ],
                },
              },
            ],
          },
        ]);
      });

      it('should let intact the query if set is already present (addSetToActiveQuery)', () => {
        const initialQuery = [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73'] },
              },
            ],
          },
        ];
        const sqons = addSetToActiveQuery({
          setId: 'ef338f7e-048a-4fab-8b0a-a6e06253ef73',
          querySqons: initialQuery,
          activeIndex: 2,
        });

        expect(sqons).to.be.deep.equal([
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'kf_id',
                  value: ['set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73'],
                },
              },
            ],
          },
        ]);
      });

      it('should add the set to the query (addSetToActiveQuery)', () => {
        const initialQuery = [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
            ],
          },
        ];
        const sqons = addSetToActiveQuery({
          setId: 'ef338f7e-048a-4fab-8b0a-a6e06253ef73',
          querySqons: initialQuery,
          activeIndex: 1,
        });

        expect(sqons).to.be.deep.equal([
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'ethnicity', value: ['Hispanic or Latino'] } },
            ],
          },
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'diagnoses.mondo.name', value: ['skin disease (MONDO:0005093)'] },
              },
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:ef338f7e-048a-4fab-8b0a-a6e06253ef73'] },
              },
            ],
          },
        ]);
      });
    });
    describe('addFieldToActiveQuery', () => {
      it('should add the field to the active sqon query', () => {
        const initialQuery = [
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'family.family_compositions.composition', value: ['trio'] },
              },
              { op: 'in', content: { field: 'gender', value: ['Male'] } },
            ],
          },
          {
            op: 'and',
            content: [{ op: 'in', content: { field: 'outcome.disease_related', value: ['Yes'] } }],
          },
        ];

        const testSqon = addFieldToActiveQuery({
          term: { field: 'new_field', value: 'new_value' },
          querySqons: initialQuery,
          activeIndex: 0,
        });

        expect(testSqon).to.be.deep.equal([
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'family.family_compositions.composition', value: ['trio'] },
              },
              { op: 'in', content: { field: 'gender', value: ['Male'] } },
              { op: 'in', content: { field: 'new_field', value: ['new_value'] } },
            ],
          },
          {
            op: 'and',
            content: [{ op: 'in', content: { field: 'outcome.disease_related', value: ['Yes'] } }],
          },
        ]);
      });

      it('should add the field to existing same fields if exists', () => {
        const initialQuery = [
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'family.family_compositions.composition', value: ['trio'] },
              },
              { op: 'in', content: { field: 'gender', value: ['Male'] } },
              { op: 'in', content: { field: 'new_field', value: ['existing_value'] } },
            ],
          },
          {
            op: 'and',
            content: [{ op: 'in', content: { field: 'outcome.disease_related', value: ['Yes'] } }],
          },
        ];

        const testSqon = addFieldToActiveQuery({
          term: { field: 'new_field', value: 'new_value' },
          querySqons: initialQuery,
          activeIndex: 0,
        });

        expect(testSqon).to.be.deep.equal([
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'family.family_compositions.composition', value: ['trio'] },
              },
              { op: 'in', content: { field: 'gender', value: ['Male'] } },
              { op: 'in', content: { field: 'new_field', value: ['existing_value', 'new_value'] } },
            ],
          },
          {
            op: 'and',
            content: [{ op: 'in', content: { field: 'outcome.disease_related', value: ['Yes'] } }],
          },
        ]);
      });
    });
  });
});
