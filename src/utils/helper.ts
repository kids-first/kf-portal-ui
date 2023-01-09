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

const KEBAB_REGEX = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
export const toKebabCase = (str: string) => {
  const match: string[] = (str && str.match(KEBAB_REGEX)) || [];
  return match.map((x: string) => x.toLowerCase()).join('-');
};
