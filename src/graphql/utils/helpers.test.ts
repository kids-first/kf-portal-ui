import { toNodes } from './helpers';

describe(`${toNodes.name}()`, () => {
  test('should handle edge case', () => {
    expect(
      toNodes({
        hits: {
          edges: [],
        },
      }),
    ).toEqual([]);
  });
  test('should return nodes content', () => {
    expect(
      toNodes({
        hits: {
          edges: [
            { node: { prop: false } },
            { node: { prop: true, a: 'a' } },
            { node: { prop: true, b: 'b' } },
          ],
        },
      }),
    ).toEqual([{ prop: false }, { prop: true, a: 'a' }, { prop: true, b: 'b' }]);
  });
});
