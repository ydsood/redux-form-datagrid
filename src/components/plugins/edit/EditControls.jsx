import React, { Fragment } from "react";
import { Button } from "semantic-ui-react";

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

type State = {
  modalOpen: Boolean,
};

class EditControls extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };
  }

  render() {
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
      editButtonAriaLabel,
    } = this.props;
    const { modalOpen } = this.state;

    const selectedIndices = selectableData
      .filter((record) => record.reduxFormIsSelected)
      .map((record) => record.reduxFormIndex);

    return editIndividualRows ? (
      <Fragment>
        <Button.Group basic compact>
          {bulkEdit && (
            <Fragment>
              {(selectedIndices.length !== selectableData.length) && (
                <Button
                  icon="check square outline"
                  content={isFiltered ? selectAllFilteredButtonLabel : selectAllButtonLabel}
                  onClick={() => {
                    editHandler.select(...selectableData.map((record) => record.reduxFormIndex));
                    updateGridState();
                  }}
                />
              )}
              {(selectedIndices.length > 0) && (
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
                    content={`${bulkEditButtonLabel} (${selectedIndices.length})`}
                    onClick={() => this.setState({ modalOpen: true })}
                  />
                  <Button
                    icon="trash"
                    content={`${bulkDeleteButtonLabel} (${selectedIndices.length})`}
                    onClick={() => removeMultiple(...selectedIndices)}
                  />
                </Fragment>
              )}
              <BulkEditModal
                open={modalOpen}
                onClose={() => this.setState({ modalOpen: false })}
                columnModel={columnModel}
                selectedRecords={selectedIndices}
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
      <Button
        basic
        icon="pencil"
        aria-label={editButtonAriaLabel || editButtonLabel}
        content={editButtonLabel}
        onClick={() => startEditingContent()} 
      />
    );
  }
}

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
