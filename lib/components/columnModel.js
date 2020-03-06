import type { ComponentType } from 'react';

const columnModelData = Symbol('Column Model');

export type column = {
  dataIndex: string,
  name: string,
  editor?: ComponentType<*>,
  singleField?: boolean,
  order: number,
  formatter?: (val: any) => any,
  meta?: {
    required: boolean,
    label: string,
    entity: string
  }
};

export const sortingFunction = (a, b) => {
  if (!a.order) {
    return 1;
  }
  if (!b.order) {
    return -1;
  }
  if (a.order >= b.order) {
    return 1;
  }
  return -1;
};

export default class ColumnModel {
  constructor(colModelData: Array<Object>) {
    this[columnModelData] = colModelData.sort(sortingFunction);
  }

  get() {
    return this[columnModelData];
  }
}
