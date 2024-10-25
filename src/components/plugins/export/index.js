import ExportControls from "./ExportControls";
import RemoteStoreExportControls from "./RemoteStoreExportControls";

const GetExportControls = (mode: "remote" | "local") => {
  if (mode === "remote") {
    return RemoteStoreExportControls;
  }

  return ExportControls;
};

export default GetExportControls;
