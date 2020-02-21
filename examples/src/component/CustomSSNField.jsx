import React from 'react';
import { Field } from 'redux-form';
import type { FormFieldProps } from 'redux-form';
import { Input, Form, Message, Icon } from 'semantic-ui-react';

type Props = {
  props: *,
}


const customSSNDisplayField = ({input, meta, ...rest}:FormFieldProps & Props) => {
  const { error:errorMessage, touched, warning:warningMessage } = meta;
  const { name } = input;
  const errorBlock = touched
  && ((errorMessage && <p><Icon size="tiny" name="exclamation" color="red" inverted circular />{errorMessage}</p>)
    || (warningMessage && <Message warning content={warningMessage} />));
  return (
    <Form.Field
      name={name}
      error={touched && errorMessage}
    >
      <label>
        {rest.label}
        <Input
          {...input}
        />
      </label>
      {errorBlock}
    </Form.Field>
  );
}

const formatter = (value) => {
  if (!value) {
    return value || "";
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if (onlyNums.length <= 5) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  }
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 5)}-${onlyNums.slice(5, 9)}`;
}

const onlyNumberNormalizer = (value: string, valueLen: number) => {
  if (!value) {
    return value;
  }
  let onlyNums = value.replace(/[^\d]/g, "");
  if (valueLen !== 0) {
    onlyNums = onlyNums.slice(0, valueLen);
  }
  return onlyNums;
};

const onlyNumberValidator = (value: string, expectedLength: number, fieldName: string) => {
  let errorMsg;
  if (!value) {
    return errorMsg;
  }
  if (value.length !== expectedLength) {
    errorMsg = `${fieldName} must be ${expectedLength} digits long`;
  }

  if (!/^\d+$/.test(value)) {
    errorMsg = `${fieldName} cannot contain any other digits`;
  }
  return errorMsg;
};

const customFormField = ({name, props}) => (
  <Field
    component={customSSNDisplayField}
    name={name}
    label={props.label}
    format={formatter}
    validate={(value) => onlyNumberValidator(value, 9, "Social Security Number")}
    normalize={(value) => onlyNumberNormalizer(value, 9)}
  />
);

export default customFormField;