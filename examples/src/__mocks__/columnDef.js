import React from 'react';
import type { ComponentType } from 'react';
import { Icon } from 'semantic-ui-react';

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

const defaultColumnValue = {
  editor: undefined,
  meta: {}
};

const columns: Array<column> = [
  {
    dataIndex: 'name',
    name: 'Name',
    order: 1,
    sortable: true,
    sortingType: 'string',
    sortComparator: (first, second) => {
      if (first < second) {
        return true;
      }
      return false;
    }
  },
  {
    dataIndex: 'govtID',
    name: 'Government ID',
    order: 2,
    sortable: true,
    sortingType: 'number',
    sortComparator: 'default', // can be skipped and default should be used
    // formatter should only be called if data is valid else render value as is with error
    // formatter should only be called for non empty, non-null values
    /*not implemented yet*/
    validator: value => {
      if (value.length === 9) {
        return true;
      }
      return false;
    },
    // Can custom render cell values (might be key for redux form)
    formatter: value =>
      `${value.substring(0, 3)}-${value.substring(3, 5)}-${value.substring(5)}`
  },
  {
    dataIndex: 'homePhone',
    name: 'Home Phone',
    order: 3,
    sortable: true,
    sortingType: 'number',
    // skipping default comparator
    // skipping formatter, same value should be rendered
  },
  {
    dataIndex: 'insuredDate',
    name: 'Insured Date',
    order: 4,
    sortable: true,
    sortingType: 'date',
  },
  {
    dataIndex: 'workPhone',
    name: 'Work Phone',
    // missing order should be pushed to end
    formatter: value => (
      <div>
        <Icon name="phone" />
        {value && `(${value.substring(0, 3)})-${value.substring(3, 6)}-${value.substring(
          6
        )}`}
      </div>
    )
  }
];

export default columns;
