import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import exportUtil from "./util";
import type {
  RemoteStore as RemoteStoreType,
} from "../../store";

type Props = {
  store: RemoteStoreType,
  query: Object,
  columnModel: Array<Object>,
  exportButtonLabel?: string,
  exportFileName?: string,
}

// Remote Store Export export all data in the grid, not just the rendering page
// it ignores pagination information, sorting information.
// only thing takes effect for the data is the filtering query
const RemoteStoreExportControls = (props: Props) => {
  const {
    exportFileName, columnModel, store, exportButtonLabel, query,
  } = props;
  const [loading, setIsLoading] = useState(false);

  const exportData = async () => {
    setIsLoading(true);
    const { data } = await store.getData({ ...query });
    setIsLoading(false);
    exportUtil(exportFileName, data, columnModel);
  };

  return (
    <Button.Group basic compact>
      <Button loading={loading} icon="file excel" content={exportButtonLabel} onClick={exportData} />
    </Button.Group>
  );
};

RemoteStoreExportControls.defaultProps = {
  exportButtonLabel: "Export",
  exportFileName: "GridData",
};

export default RemoteStoreExportControls;
