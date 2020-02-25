// @flow
import React, { Fragment } from 'react';
import type { FormFieldProps } from 'redux-form';
import { Input, Form, Message } from 'semantic-ui-react';

export const RequiredFieldValidator = (value: *) => {
  if (!value && value !== 0) {
    return 'Required';
  }
  return undefined;
};

// eslint-disable-next-line react/prefer-stateless-function
export default class SemanticReduxFormField extends React.Component<FormFieldProps> {
  render() {
    const {
      input,
      label,
      fieldClass,
      required,
      meta: { touched, error, warning },
      as: As = Input,
      ...props
    } = this.props;
    const errorBlock = touched
      && ((error && <Message error content={error} />)
        || (warning && <Message warning content={warning} />));
    const displayValue = props.hidden ? 'none' : '';
    const name = props.name ? props.name : input.name;
    return (
      <Fragment>
        <Form.Field
          width={props.width}
          name={name}
          error={touched && error}
          required={required}
          style={{ display: displayValue }}
        >
          <label>
            {label}
          </label>
          <As
            {...input}
          />
          {errorBlock}
        </Form.Field>
      </Fragment>
    );
  }
}
