import React, { Fragment, useState } from "react";
import { Button } from "semantic-ui-react";
import _ from "lodash";

import EditHandler from "./EditHandler";
import BulkEditModal from "./BulkEditModal";

type Props = {
  editIndividualRows: boolean,
  bulkEdit: boolean,
  startEditingContent: Function,
  editButtonLabel?: string,
  addContent: Function,
  removeMultiple: Function,
  addButtonLabel?: string,
  bulkEditButtonLabel?: string,
  bulkDeleteButtonLabel?: string,
  selectAllButtonLabel?: string,
  selectAllFilteredButtonLabel?: string,
  unselectAllButtonLabel?: string,
  editHandler: EditHandler,
  selectableData: Array<Object>,
  isFiltered: boolean,
  updateGridState: Function,
  columnModel: Array<Object>,
  formName: String,
  fieldName: String,
}

const EditControls = (props: Props) => {
  const {
    editIndividualRows,
    bulkEdit,
    addButtonLabel,
    bulkEditButtonLabel,
    bulkDeleteButtonLabel,
    selectAllButtonLabel,
    selectAllFilteredButtonLabel,
    unselectAllButtonLabel,
    editButtonLabel,
    addContent,
    removeMultiple,
    startEditingContent,
    editHandler,
    selectableData,
    isFiltered,
    updateGridState,
    columnModel,
    formName,
    fieldName,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);

  return editIndividualRows ? (
    <Fragment>
      <Button.Group basic compact>
        {bulkEdit && (
          <Fragment>
            {!_.isEqual(
              _.sortBy(editHandler.selectedRecords),
              _.sortBy(selectableData.map((record) => record.reduxFormIndex)),
            ) && (
              <Button
                icon="check square outline"
                content={isFiltered ? selectAllFilteredButtonLabel : selectAllButtonLabel}
                onClick={() => {
                  editHandler.select(...selectableData.map((record) => record.reduxFormIndex));
                  updateGridState();
                }}
              />
            )}
            {(editHandler.selectedRecords.length > 0) && (
              <Fragment>
                <Button
                  icon="square outline"
                  content={unselectAllButtonLabel}
                  onClick={() => {
                    editHandler.clearAllSelected();
                    updateGridState();
                  }}
                />
                <Button
                  icon="edit"
                  content={`${bulkEditButtonLabel} (${editHandler.selectedRecords.length})`}
                  onClick={() => setModalOpen(true)}
                />
                <Button
                  icon="trash"
                  content={`${bulkDeleteButtonLabel} (${editHandler.selectedRecords.length})`}
                  onClick={() => removeMultiple(...editHandler.selectedRecords)}
                />
              </Fragment>
            )}
            <BulkEditModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              columnModel={columnModel}
              selectedRecords={editHandler.selectedRecords}
              formName={formName}
              fieldName={fieldName}
            />
          </Fragment>
        )}

        <Button
          icon="add"
          content={addButtonLabel}
          onClick={() => addContent()}
        />
      </Button.Group>
    </Fragment>
  ) : (
    <Button basic icon="pencil" content={editButtonLabel} onClick={() => startEditingContent()} />
  );
};

EditControls.defaultProps = {
  editButtonLabel: undefined,
  addButtonLabel: undefined,
  bulkEditButtonLabel: "Edit Selected",
  bulkDeleteButtonLabel: "Delete Selected",
  selectAllButtonLabel: "Select All",
  selectAllFilteredButtonLabel: "Select All Filtered Results",
  unselectAllButtonLabel: "Unselect All",
};

export default EditControls;
