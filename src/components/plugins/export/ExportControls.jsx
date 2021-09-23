import React, { Component } from "react";
import { Button } from "semantic-ui-react";

type Props = {
  data?: Array<Object>,
  columnModel: Array<Object>,
  exportButtonLabel?: string,
  exportFileName?: string,
}

class ExportControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.exportData = this.exportData.bind(this);
  }

  exportData() {
    const { exportFileName, data, columnModel } = this.props;
    let CSV = "";
    let header = "";

    columnModel.forEach((element) => {
      if (element.export) {
        header += `${element.name},`;
      }
    });

    header = header.slice(0, -1);
    CSV += `${header}\r\n`;

    for (let i = 0; i < data.length; i += 1) {
      let rowData = "";
      for (let j = 0; j < columnModel.length; j += 1) {
        if (columnModel[j].export) {
          const value = columnModel[j].formatter
            ? columnModel[j].formatter(data[i][columnModel[j].dataIndex])
            : data[i][columnModel[j].dataIndex];
          rowData += `${value},`;
        }
      }
      rowData.slice(0, rowData.length - 1);
      CSV += `${rowData}\r\n`;
    }

    if (CSV === "") {
      return;
    }
    const uri = `data:text/csv;charset=utf-8,${escape(CSV)}`;
    const link = document.createElement("a");
    link.href = uri;
    link.style = "visibility: hidden";
    link.download = `${exportFileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    const { exportButtonLabel, data } = this.props;
    if (data.length) {
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
  data: [],
};

export default ExportControls;
