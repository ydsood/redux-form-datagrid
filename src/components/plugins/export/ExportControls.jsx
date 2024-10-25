import React, { Component } from "react";
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

class ExportControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.exportData = this.exportData.bind(this);
    this.data = props.store.getData();
  }

  exportData() {
    const { exportFileName, columnModel } = this.props;
    exportUtil(exportFileName, this.data, columnModel);
  }

  render() {
    const { exportButtonLabel } = this.props;
    if (this.data.length) {
      return (
        <Button.Group basic compact>
          <Button icon="file excel" content={exportButtonLabel} onClick={() => this.exportData()} />
        </Button.Group>
      );
    }
    return "";
  }
}

ExportControls.defaultProps = {
  exportButtonLabel: "Export",
  exportFileName: "GridData",
};

export default ExportControls;
