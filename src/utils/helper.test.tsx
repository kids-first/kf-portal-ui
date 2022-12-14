import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { SorterResult } from 'antd/lib/table/interface';

import { formatQuerySortList, getOrderFromAntdValue } from './helper';

describe('getOrderFromAntdValue()', () => {
  test('should return SortDirection.Asc for "ascend"', () => {
    expect(getOrderFromAntdValue('ascend')).toBe(SortDirection.Asc);
  });

  test('should return SortDirection.Desc for any other value', () => {
    expect(getOrderFromAntdValue('foo')).toBe(SortDirection.Desc);
  });
});

describe('formatQuerySortList()', () => {
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
});
