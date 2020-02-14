// @flow
import React, { Fragment } from 'react';
import type { FieldArrayProps } from 'redux-form';
import { Field } from 'redux-form';
import _ from 'lodash';
import {
  Form, Modal, Button, Segment, Label, Header,
} from 'semantic-ui-react';
import type { column } from '../columnModel';
import DataGrid from '../datagrid';
import DefaultFormField from './DefaultFormField';

type DatagridProps = {
  columnModel: Array<column>,
}


const RequiredFieldValidator = (value: *) => {
  if (!value && (value !== 0)) return 'Required';
  return undefined;
};

const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

class DatagridField extends React.Component<FieldArrayProps & DatagridProps, *> {
  constructor(props: FieldArrayProps & DatagridProps) {
    super(props);
    this.state = { addingContent: false };
    this.doneEditingContent = this.doneEditingContent.bind(this);
    this.startEditingContent = this.startEditingContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.removeContent = this.removeContent.bind(this);
  }

  buildDataFromFields() {
    const { fields } = this.props;
    return fields.getAll() || [];
  }

  buildFormFieldsModal(fieldName: string, index: number) {
    const { columnModel } = this.props;
    const chunkedColumnModel = _.chunk(columnModel, 2);
    const fieldToRender = chunkedColumnModel.map(columns => (
      <Form.Group widths="equal">
        {
          columns.map(item => (
            <Field
              name={`${fieldName}.${item.dataIndex}`}
              component={DefaultFormField}
              label={(item.meta && item.meta.label) || item.name}
              validate={RequiredFieldValidator}
            />
          ))
        }
      </Form.Group>
    ));
    const segmentColorIndex = Math.floor(Math.random() * Math.floor(colors.length));
    return (
      <Segment color={colors[segmentColorIndex]}>
        <Header size="small">{`# ${index + 1}`}</Header>
        <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => this.removeContent(data.index)} />
        {fieldToRender}
      </Segment>
    );
  }

  doneEditingContent: Function;

  doneEditingContent() {
    this.setState({ addingContent: false });
  }

  startEditingContent: Function;

  startEditingContent() {
    this.setState({ addingContent: true });
  }

  addContent: Function;

  addContent() {
    const { fields, columnModel } = this.props;
    if (!fields || !fields.push) {
      throw Error(`Incorrect fields prop passed to FieldArray renderer component: ${JSON.stringify(fields)}`);
    } else {
      const newItem = columnModel
        .map(x => x.dataIndex)
        .reduce((acc, curr) => {
          acc[curr] = undefined;
          return acc;
        }, {});
      fields.push(newItem);
    }
  }

  removeContent: Function;

  removeContent(index: number) {
    const { fields } = this.props;
    fields.remove(index);
  }

  render() {
    const data = this.buildDataFromFields();
    const { addingContent } = this.state;
    const { fields } = this.props;
    const formFields = fields.map((fieldName, index) => this.buildFormFieldsModal(fieldName, index));
    return (
      <Fragment>
        <DataGrid
          {...this.props}
          editable
          data={data}
          startEditingContent={this.startEditingContent}
        />
        <Modal
          open={addingContent}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          onClose={this.doneEditingContent}
        >
          <Modal.Content open={addingContent}>
            <Form>
              { formFields }
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.addContent}
              positive
              labelPosition="right"
              icon="plus"
              content="Add"
            />
            <Button
              onClick={this.doneEditingContent}
              positive
              labelPosition="right"
              icon="checkmark"
              content="Done"
            />
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

export default DatagridField;
