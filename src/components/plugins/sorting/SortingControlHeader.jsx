import React from "react";
import { Table } from "semantic-ui-react";
import SortingHandler from "./SortingHandler";

type Props = {
  sortingHandler: SortingHandler,
  updateGridState: Function,
  column: Object,
};

const SortingControlHeader = ({
  sortingHandler,
  updateGridState,
  column,
}: Props) => {
  let sorted;
  if (column.dataIndex === sortingHandler.activeColumn) {
    sorted = sortingHandler.isAscending ? "ascending" : "descending";
  }

  return (
    <Table.HeaderCell
      key={column.dataIndex}
      onClick={() => {
        sortingHandler.updateActiveColumn(column.dataIndex);
        updateGridState();
      }}
      sorted={sorted}
    >
      {column.name}
    </Table.HeaderCell>
  );
};

export default SortingControlHeader;
