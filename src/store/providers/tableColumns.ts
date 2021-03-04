import { makeVar } from '@apollo/client';

const getTableColumns = (): Record<string, any> =>
  JSON.parse(localStorage.getItem('tableColumns') || '{}') || {};
export const configureColumns = (original: Array<any>, newOrder: Array<any>): Array<any> => {
  const newDataOrder: Array<any> = [];
  newOrder.forEach((newValue) => {
    for (let i = 0; i < original.length; i++) {
      if (original[i].initialOrder === newValue.order) {
        newDataOrder.push({ ...original[i], hidden: newValue.hidden });
        break;
      }
    }
  });
  return newDataOrder;
};

export const setTableColumn = (key: string, data: any): void => {
  tableColumns({
    ...tableColumns(),
    [key]: data.reduce(
      (acc: string[], item: any) => [...acc, { hidden: item.hidden, order: item.initialOrder }],
      [],
    ),
  });
  localStorage.setItem('tableColumns', JSON.stringify(tableColumns()));
};
export const tableColumns = makeVar<Record<string, any>>(getTableColumns());
