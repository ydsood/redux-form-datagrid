import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import Icon from '../../../elements/icons';

type Props = {
  startEditingContent: Function,
  editButtonLabel: string,
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

  render() {
    const { editButtonLabel } = this.props;
    return (
      <Table.HeaderCell textAlign="left">
        <Icon link name="pencil" onClick={() => this.edit()} />
        {
          editButtonLabel
          && (
            <span>{editButtonLabel}</span>
          )
        }
      </Table.HeaderCell>
    );
  }
}


export default EditControls;
