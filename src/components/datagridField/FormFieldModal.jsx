// @flow
import React, { Fragment } from "react";
import {
  Form, Modal, Button, Segment, Label,
} from "semantic-ui-react";
import _ from "lodash";
import { createUseStyles } from "react-jss";
import { renderFieldsAndSubsections } from "./util";

type Props = {
  fields: *,
  columnModel: Array<Object>,
  subsections: Array<Object>,
  open: boolean,
  doneEditingContent: Function,
  addContent: Function,
  removeContent: Function,
  addButtonLabel?: string,
  doneButtonLabel?: string,
  currentFieldIndex: number,
  editIndividualRows: boolean,
  closeOnEscape: boolean,
  classes: Object,
}

class FormFieldModal extends React.Component<Props> {
  
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  // eslint-disable-next-line class-methods-use-this
  applyFieldResolvers(columnModel, rowData) {
    return columnModel.map((column) => {
      const colModelCopy = _.cloneDeep(columnModel);
      const { fieldMetaResolver = [] } = column;
      let meta = column.meta || {};

      for (let i = 0; i < fieldMetaResolver.length; i += 1) {
        const fieldResolver = fieldMetaResolver[i];

        if (typeof fieldResolver === "function") {
          meta = fieldResolver(colModelCopy, rowData, column.dataIndex) || meta;
        }
      }

      return {
        ...column,
        meta,
      };
    });
  }

  buildFormFields(fieldName: string, index: number, fields: *) {
    const {
      columnModel,
      subsections = [],
    } = this.props;

    const resolvedColumnModel = this.applyFieldResolvers(columnModel, fields.get(index));

    const subsectionGroupedFields = _.groupBy(resolvedColumnModel, (field) => field.subsection || "none");

    let fieldsAndSubsections = subsections.map((subsection) => ({
      ...subsection,
      fields: subsectionGroupedFields[subsection.name] || [],
    }));

    if (subsectionGroupedFields.none) {
      fieldsAndSubsections = [...fieldsAndSubsections, ...subsectionGroupedFields.none];
    }

    const groupedItems = renderFieldsAndSubsections(
      fieldsAndSubsections.sort((a, b) => a.order - b.order),
      fieldName,
    );

    return groupedItems;
  }

  componentDidUpdate(prevProps){
    const { open } = this.props;
    if(open && open !== prevProps.open){
      const node = this.myRef.ref.current;
      // find out all interactive fields
      const focusableModalElements = node.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableModalElements[0];
      firstElement.focus();
    }
  }

  render() {
    const {
      fields,
      open,
      doneEditingContent,
      addContent,
      addButtonLabel,
      doneButtonLabel,
      editIndividualRows,
      currentFieldIndex,
      removeContent,
      closeOnEscape,
      classes,
    } = this.props;

    let formFields = null;
    if (!editIndividualRows) {
      formFields = fields.map((fieldName, index) => (
        <Segment key={fieldName} color="black">
          <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
          {this.buildFormFields(fieldName, index, fields)}
        </Segment>
      ));
    } else if (currentFieldIndex > -1 && currentFieldIndex < fields.length) {
      formFields = this.buildFormFields(
        fields.map((field) => field)[currentFieldIndex],
        currentFieldIndex,
        fields,
      );
    }

    return (
      <Fragment>
        <Modal
          open={open}
          closeOnDimmerClick
          closeOnEscape={closeOnEscape}
          onClose={doneEditingContent}
          className={classes.editModal}
          ref={(domRef) => {
            this.myRef=domRef;
          }}
        >
          <Modal.Content open={open}>
            <Form>
              { formFields }
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {!editIndividualRows && (
              <Button
                onClick={addContent}
                positive
                labelPosition="right"
                icon="plus"
                content={addButtonLabel}
              />
            )}
            <Button
              onClick={doneEditingContent}
              positive
              labelPosition="right"
              icon="checkmark"
              content={doneButtonLabel}
            />
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

FormFieldModal.defaultProps = {
  addButtonLabel: "Add",
  doneButtonLabel: "Done",
};

const styles = {
  editModal: {
    "& .ui.accordion": {
      margin: "0 0 1em 0 !important",
    },
  },
};

export default (props) => (
  <FormFieldModal {...props} classes={createUseStyles(styles)()} />
);
