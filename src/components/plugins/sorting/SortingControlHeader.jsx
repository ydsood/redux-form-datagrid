import React from "react";
import { Table } from "semantic-ui-react";
import SortingHandler from "./SortingHandler";

type Props = {
  sortingHandler: SortingHandler,
  updateGridState: Function,
  column: Object,
  classes: Object,
  basic:string
};

const SortingControlHeader = ({
  sortingHandler,
  updateGridState,
  basic,
  classes,
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
      className={basic === "very" ? classes.veryBasicGrid : ""}
    >
      {column.name}
    </Table.HeaderCell>
  );
};

export default SortingControlHeader;
