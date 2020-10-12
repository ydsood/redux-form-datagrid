// @flow
export type SearchHandlerProps = {
  columnModel: Array<Object>,
}

type State = {
  columnModel: Array<Object>,
};

export default class PaginationHandler {
  state: State;

  constructor(columnModel: Array<Object>) {
    this.state = { columnModel };
    this.filterData = this.filterData.bind(this);
  }

  filterData(
    data: Array<Object>,
    columnFilters: Array<Object>,
    inputValue: String,
  ): Array<Object> {
    const { columnModel } = this.state;

    let gridData = data;
    if (columnFilters && columnFilters.length) {
      columnFilters.forEach((element) => {
        gridData = gridData.filter((item) => {
          const recordTextValue = item[element.dataIndex] && (
            (element.formatter && element.formatter(item[element.dataIndex]))
            || item[element.dataIndex]
          );

          return recordTextValue && recordTextValue === element.text;
        });
      });
    }

    const searchByTextColumns = columnModel.filter(
      (column) => column.searchByText || column.searchByTag,
    );
    if (searchByTextColumns.length && inputValue && inputValue !== "") {
      gridData = gridData.filter((item) => {
        for (let i = 0; i < searchByTextColumns.length; i += 1) {
          const column = searchByTextColumns[i];

          const recordTextValue = item[column.dataIndex] && (
            (column.formatter && column.formatter(item[column.dataIndex]))
            || item[column.dataIndex]
          );

          if (
            recordTextValue
            && recordTextValue.toLowerCase().includes(inputValue.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
    }

    return gridData;
  }
}
