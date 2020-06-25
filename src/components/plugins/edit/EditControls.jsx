import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";

type Props = {
  startEditingContent: Function,
  editButtonLabel?: string,
}

class EditControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.edit = this.edit.bind(this);
  }

  edit(): Array<Object> {
    const { startEditingContent } = this.props;
    startEditingContent();
  }

  editButton() {
    const { editButtonLabel } = this.props;
    if (editButtonLabel) {
      return (
        <Button basic icon labelPosition="left" onClick={() => this.edit()} className="grid-edit-button">
          <Icon name="pencil" />
          {editButtonLabel}
        </Button>
      );
    }
    return <Icon link name="pencil" onClick={() => this.edit()} />;
  }

  render() {
    return (
      <Table.HeaderCell textAlign="left">
        {this.editButton()}
      </Table.HeaderCell>
    );
  }
}

EditControls.defaultProps = {
  editButtonLabel: "",
};

export default EditControls;
