// @flow
import React from 'react';
import {
  Form, Modal, Button, Segment, Label, Header,
} from 'semantic-ui-react';
import { Field } from 'redux-form';
import _ from 'lodash';
import DefaultFormField, { RequiredFieldValidator } from './DefaultFormField';

type Props = {
  fields: *,
  columnModel: Array<Object>,
  open: boolean,
  doneEditingContent: Function,
  addContent: Function,
  removeContent: Function,
}

const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey'];

class FormFieldModal extends React.Component<Props> {
  buildFormFieldsModal(fieldName: string, index: number) {
    const { columnModel, removeContent } = this.props;
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
        <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
        {fieldToRender}
      </Segment>
    );
  }

  render() {
    const {
      fields, open, doneEditingContent, addContent,
    } = this.props;
    const formFields = fields
      .map((fieldName, index) => this.buildFormFieldsModal(fieldName, index));
    return (
      <Modal
        open={open}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onClose={doneEditingContent}
      >
        <Modal.Content open={open}>
          <Form>
            { formFields }
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={addContent}
            positive
            labelPosition="right"
            icon="plus"
            content="Add"
          />
          <Button
            onClick={doneEditingContent}
            positive
            labelPosition="right"
            icon="checkmark"
            content="Done"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FormFieldModal;
