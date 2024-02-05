import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { SorterResult } from 'antd/lib/table/interface';

import { chunkIt, formatQuerySortList, getOrderFromAntdValue, keepOnly } from './helper';

describe(`${getOrderFromAntdValue.name}()`, () => {
  test('should return SortDirection.Asc for "ascend"', () => {
    expect(getOrderFromAntdValue('ascend')).toBe(SortDirection.Asc);
  });

  test('should return SortDirection.Desc for any other value', () => {
    expect(getOrderFromAntdValue('foo')).toBe(SortDirection.Desc);
  });
});

describe(`${formatQuerySortList.name}()`, () => {
  it('should handle a single sorter', () => {
    const sorter1: SorterResult<any> = {
      columnKey: 'field1',
      order: 'ascend',
    };
    expect(formatQuerySortList(sorter1)).toEqual([{ field: 'field1', order: 'asc' }]);
  });

  it('should handle an array of sorters', () => {
    const sorter2: SorterResult<any> = {
      columnKey: 'field2',
      order: 'descend',
    };
    const sorter3: SorterResult<any> = {
      columnKey: 'field3',
      order: 'ascend',
    };
    expect(formatQuerySortList([sorter2, sorter3])).toEqual([
      { field: 'field2', order: 'desc' },
      { field: 'field3', order: 'asc' },
    ]);
  });

  it('should handle an empty sorter', () => {
    expect(formatQuerySortList({})).toEqual([]);
  });
});

describe(`${chunkIt.name}()`, () => {
  it('should chunk and array into chunks', () => {
    expect(chunkIt(['a', 'b', 'c'], 2)).toEqual([['a', 'b'], ['c']]);
  });
});

describe(`${keepOnly.name}()`, () => {
  it('should handle edge case', () => {
    expect(keepOnly({ a: null, b: undefined })).toEqual({});
  });

  it('should keep only wanted entries', () => {
    expect(keepOnly({ a: 'a', b: 2 }, ([, v]) => typeof v === 'number')).toEqual({ b: 2 });
  });
});
