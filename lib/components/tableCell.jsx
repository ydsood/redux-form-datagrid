import React from 'react';


type TableCellProps = {
  column: Object,
  value: *,
};

export default function TableCell(props: TableCellProps) {
  const {
    value,
    column: {
      formatter,
    },
  } = props;
  return <div>{formatter ? formatter(value) : value}</div>;
}
