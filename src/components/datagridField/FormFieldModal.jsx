// @flow
import React, { Fragment } from "react";
import {
  Form, Modal, Button, Segment, Label,
} from "semantic-ui-react";
import _ from "lodash";
import { createUseStyles } from "react-jss";
import { renderFieldsAndSubsections, applyFieldResolvers } from "./util";

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

  buildFormFields(fieldName: string, index: number, fields: *, totalDataRows: number) {
    const {
      columnModel,
      subsections = [],
    } = this.props;

    const resolvedColumnModel = applyFieldResolvers(columnModel, fields.get(index));

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
      index,
      totalDataRows,
    );

    return groupedItems;
  }

  componentDidUpdate(prevProps){
    const { open, fields } = this.props;
    if(open && open !== prevProps.open){
      const node = this.myRef.ref.current;
      // find out all interactive fields
      const focusableModalElements = node.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableModalElements[0];
      firstElement.focus();
    }
    else if(fields && prevProps.fields && fields.length !== prevProps.fields.length){
      const node = this.myRef.ref.current;
      if(node){
        // find the interactive elements on the latest segment
        const segments = node.querySelectorAll(".segment");
        if(segments && fields.length > 0){
          const elements = segments[fields.length - 1]
          .querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select');
          const firstElement = elements[0];
          firstElement.scrollIntoView(true);
          firstElement.focus();
        }
        
      }
      
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
    const totalDataRows = fields.length;
    if (!editIndividualRows) {
      formFields = fields.map((fieldName, index) => (
        <Segment key={fieldName} color="black">
          <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
          {this.buildFormFields(fieldName, index, fields, totalDataRows)}
        </Segment>
      ));
    } else if (currentFieldIndex > -1 && currentFieldIndex < fields.length) {
      formFields = this.buildFormFields(
        fields.map((field) => field)[currentFieldIndex],
        currentFieldIndex,
        fields,
        totalDataRows,
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
