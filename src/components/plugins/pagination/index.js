// @flow

import PaginationControls from "./PaginationControls";
import PaginationHandler from "./PaginationHandler";
import RemotePaginationHandler from "./RemotePaginationHandler";

const GetPaginationHandler = (mode: "remote" | "local", pageSize: number) => {
  if (mode === "remote") {
    return new RemotePaginationHandler(pageSize);
  }

  return new PaginationHandler(pageSize);
};

export {
  PaginationControls,
  GetPaginationHandler,
};
