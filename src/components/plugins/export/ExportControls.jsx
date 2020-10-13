import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";

type Props = {
  exportData: Array<Object>,
  columnModel: Array<Object>,
  exportButtonLabel?: string,
  fileName?: string,
}

class ExportControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.exportData = this.exportData.bind(this);
  }

  exportData() {
    const { fileName, exportData, columnModel } = this.props;
    let CSV = '';
    let header = '';

    if (columnModel && columnModel.length && exportData && exportData.length) {
      columnModel.forEach((element) => {
        header += `${element.name},`;
      });

      header = header.slice(0, -1);
      CSV += `${header}\r\n`;

      for (let i = 0; i < exportData.length; i += 1) {
        let rowData = '';
        for (let j = 0; j < columnModel.length; j += 1) {
          rowData += `${exportData[i][columnModel[j].dataIndex]},`;
        }
        rowData.slice(0, rowData.length - 1);
        CSV += `${rowData}\r\n`;
      }

      if (CSV === '') {
        return;
      }
      const uri = `data:text/csv;charset=utf-8,${escape(CSV)}`;
      const link = document.createElement('a');
      link.href = uri;
      link.style = 'visibility: hidden';
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  exportButton() {
    const { exportButtonLabel, exportData } = this.props;
    if (exportData.length) {
      return (
        <Button basic icon labelPosition="left" onClick={() => this.exportData()} className="grid-edit-button">
          <Icon name="file excel" />
          {exportButtonLabel}
        </Button>
      );
    }
    return '';
  }

  render() {
    return (
      <Table.HeaderCell textAlign="left">
        {this.exportButton()}
      </Table.HeaderCell>
    );
  }
}

ExportControls.defaultProps = {
  exportButtonLabel: "Export",
  fileName: "GridData",
  exportData: [],
};

export default ExportControls;
