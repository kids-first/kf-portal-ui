import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { TSortableItems } from '@ferlab/ui/core/layout/SortableGrid/SortableItem';
import { SorterResult } from 'antd/lib/table/interface';
import { isEmpty } from 'lodash';

export const scrollToTop = (scrollContentId: string) =>
  document
    .getElementById(scrollContentId)
    ?.querySelector('.simplebar-content-wrapper')
    ?.scrollTo(0, 0);

export const orderCardIfNeeded = (cards: TSortableItems[], userCardConfig: string[] | undefined) =>
  userCardConfig
    ? cards
        .slice()
        .sort((a, b) => (userCardConfig.indexOf(a.id) > userCardConfig.indexOf(b.id) ? 1 : -1))
    : cards;

export const getOrderFromAntdValue = (order: string): SortDirection =>
  order === 'ascend' ? SortDirection.Asc : SortDirection.Desc;

export const formatQuerySortList = (sorter: SorterResult<any> | SorterResult<any>[]) =>
  isEmpty(sorter)
    ? []
    : [sorter].flat().map((sorter) => ({
        field: sorter.columnKey as string,
        order: getOrderFromAntdValue(sorter.order!),
      }));

export const getCurrentUrl = () =>
  window.location.protocol + '//' + window.location.host + window.location.pathname;

export const isNumber = (n: unknown): boolean => typeof n === 'number';

//Source: https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
export const chunkIt = (l: any[] = [], size: number = 1) =>
  Array.from({ length: Math.ceil(l.length / size) }, (_, i) => l.slice(i * size, i * size + size));

export const keepOnly = (
  o: Object,
  fn: ([key, value]: [string, any]) => boolean = ([, v]) => !!v,
) => Object.fromEntries(Object.entries(o).filter(fn));
