import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import exportUtil from "./util";
import type {
  LocalStore as LocalStoreType,
} from "../../store";

type Props = {
  store: LocalStoreType,
  columnModel: Array<Object>,
  exportButtonLabel?: string,
  exportFileName?: string,
}

const ExportControls = (props: Props) => {
  const [data, setData] = useState([]);
  const {
    store, columnModel, exportFileName, exportButtonLabel,
  } = props;
  useEffect(() => {
    const gridData = store.getData();
    setData(gridData);
  }, []);

  useEffect(() => {
    const gridData = store.getData();
    setData(gridData);
  }, [store]);

  const exportData = () => {
    exportUtil(exportFileName, data, columnModel);
  };
  if (data?.length) {
    return (
      <Button.Group basic compact>
        <Button icon="file excel" content={exportButtonLabel} onClick={() => exportData()} />
      </Button.Group>
    );
  }
  return "";
};

ExportControls.defaultProps = {
  exportButtonLabel: "Export",
  exportFileName: "GridData",
};

export default ExportControls;
