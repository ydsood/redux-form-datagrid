import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import Icon from '../../../elements/icons';

type Props = {
  startEditingContent: Function,
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
    return (
      <Table.HeaderCell textAlign="left">
        <Icon link name="pencil" onClick={() => this.edit()} />
      </Table.HeaderCell>
    );
  }
}


export default EditControls;
