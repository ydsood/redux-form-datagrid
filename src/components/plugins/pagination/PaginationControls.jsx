import React, { Fragment } from "react";
import { Icon } from "semantic-ui-react";

import PaginationHandler from "./PaginationHandler";

type Props = {
  paginationHandler: PaginationHandler,
  updateGridState: (Function) => void,
};

const PaginationControls = ({
  paginationHandler,
  updateGridState,
}: Props) => ((paginationHandler.data.length > 0) && (
  <Fragment>
    {!paginationHandler.isOnFirstPage() && (
      <Icon
        tabindex="0"
        role="navigation"
        aria-label="Navigate to first page"
        link
        name="angle double left"
        onClick={() => {
          paginationHandler.moveToFirstPage();
          updateGridState();
        }}
      />
    )}
    {!paginationHandler.isOnFirstPage() && (
      <Icon
        tabindex="0"
        role="navigation"
        aria-label="Navigate to previous page"
        link
        name="angle left"
        onClick={() => {
          paginationHandler.moveToPreviousPage();
          updateGridState();
        }}
      />
    )}
    <span aria-live="polite">
    <span>
      {`${paginationHandler.getFirstRecordPosition()} - ${paginationHandler.getLastRecordPosition()}`}
    </span>
    <span> of </span>
    <span>{paginationHandler.data.length}</span>
    </span>
    {!paginationHandler.isOnLastPage() && (
      <Icon
        tabindex="0"
        role="navigation"
        aria-label="Navigate to next page"
        link
        name="angle right"
        onClick={() => {
          paginationHandler.moveToNextPage();
          updateGridState();
        }}
      />
    )}
    {!paginationHandler.isOnLastPage() && (
      <Icon
        tabindex="0"
        role="navigation"
        aria-label="Navigate to last page"
        link
        name="angle double right"
        onClick={() => {
          paginationHandler.moveToLastPage();
          updateGridState();
        }}
      />
    )}
  </Fragment>
));

export default PaginationControls;
