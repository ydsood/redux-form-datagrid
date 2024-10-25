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

const ExportControls = (props: Props) => {
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

ExportControls.defaultProps = {
  exportButtonLabel: "Export",
  exportFileName: "GridData",
};

export default ExportControls;
