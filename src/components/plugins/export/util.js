// TODO: this util method is pulled from previous ExportControls component
// so it can be used for both LocalExportControl and RemoteExportControl
// looking for some other library to handle export special characters and prevent CSV injection
const exportData = (exportFileName, data, columnModel) => {
  let CSV = "";
  let header = "";

  columnModel.forEach((element) => {
    if (element.export !== false) {
      header += `${element.name},`;
    }
  });

  header = header.slice(0, -1);
  CSV += `${header}\r\n`;

  for (let i = 0; i < data.length; i += 1) {
    let rowData = "";
    for (let j = 0; j < columnModel.length; j += 1) {
      if (columnModel[j].export !== false) {
        const value = columnModel[j].getValue
          ? columnModel[j].getValue(data[i][columnModel[j].dataIndex])
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
};

export default exportData;
