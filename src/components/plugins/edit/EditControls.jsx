import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";

type Props = {
  editIndividualRows: boolean,
  startEditingContent: Function,
  editButtonLabel?: string,
  addContent: Function,
  addButtonLabel?: string,
}

class EditControls extends Component<Props> {
  editButton() {
    const { editButtonLabel } = this.props;
    if (editButtonLabel) {
      return (
        <Button basic icon labelPosition="left" onClick={() => this.props.startEditingContent()} className="grid-edit-button">
          <Icon name="pencil" />
          {editButtonLabel}
        </Button>
      );
    }
    return <Icon link name="pencil" onClick={() => this.props.startEditingContent()} />;
  }

  addButton() {
    const { addButtonLabel } = this.props;
    if (addButtonLabel) {
      return (
        <Button basic icon labelPosition="left" onClick={() => this.props.addContent()} className="grid-edit-button">
          <Icon name="add" />
          {addButtonLabel}
        </Button>
      );
    }
    return <Icon link name="add" onClick={() => this.props.addContent()} />;
  }

  render() {
    return (
      <div style={{ float: "left" }}>
        {this.props.editIndividualRows ? (
          this.addButton()
        ) : (
          this.editButton()
        )}
      </div>
    );
  }
}

EditControls.defaultProps = {
  editButtonLabel: "",
  addButtonLabel: "",
};

export default EditControls;
