import React from 'react';
import type { ComponentType } from 'react';
import StaticDatagrid from './components/datagrid';
import { PaginationHandler } from './components/plugins/pagination';
import type { PaginationHandler as PaginationHandlerType } from './components/plugins/pagination';

export type column = {
  dataIndex: string,
  name: string,
  editor?: ComponentType<*>,
  order: number,
  meta?: {
    required: boolean,
    label: string,
    entity: string
  },
  paginationHandler?: PaginationHandlerType
};

export type DataGridProps = {
  data: Array<Object> | void,
  title: string,
  getData?: Function,
  columnModel: Array<column>,
  name: string
};

function DataGrid(props: DataGridProps) {
  const {
    data, getData, title, columnModel, name,
  } = props;

  return (
    <StaticDatagrid
      data={data}
      getData={getData}
      title={title}
      columnModel={columnModel}
      name={name}
    />
  );
}

DataGrid.defaultProps = {
  getData: undefined,
};
export { PaginationHandler };
export type { PaginationHandlerType };
export default DataGrid;
