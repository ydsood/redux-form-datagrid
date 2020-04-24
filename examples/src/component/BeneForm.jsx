import React from 'react';
import { DatagridField } from 'redux-form-datagrid'; 
import { Form, Icon, Button } from 'semantic-ui-react';
import { FieldArray, reduxForm } from 'redux-form';
import type { column } from './__mocks__/columnDef';
import NoDataComponent from '../NoDataComponent';
import CustomSSNField from './CustomSSNField';

const columnModel:Array<column> = [
  {
    dataIndex: 'firstName',
    name: 'First Name',
    order: 1,
    meta:{
      label:"First Name",
      required: true,
      width: 4,
    }
  },
  {
    dataIndex: 'lastName',
    name: 'Last Name',
    order: 2,
    meta:{
      label:"Last Name",
      required: true,
      width: 12,
    }
  },
  {
    dataIndex: 'govtID',
    name: 'Government ID',
    order: 4,
    sortComparator: 'default',
    editor: CustomSSNField,
    formatter: value =>
      value && `${value.substring(0, 3)}-${value.substring(3, 5)}-${value.substring(5)}`,
    meta:{
      label:'Government ID',
      width: 4,
    }
  },
  {
    dataIndex: 'phone',
    name: 'Phone',
    // missing order should be pushed to end
    formatter: value => (
      <div>
        <Icon name="phone" />
        {value && `(${value.substring(0, 3)})-${value.substring(3, 6)}-${value.substring(
          6
        )}`}
      </div>
    ),
    meta:{
      label:'Phone',
    }
  }
];

const beneForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return(
    <Form onSubmit={handleSubmit(data => alert(JSON.stringify(data)))}>
      <FieldArray component={DatagridField} name="beneficiaryGrid" title="Beneficiary Form" editButtonLabel="Edit Beneficiary" columnModel={columnModel} noDataComponent={NoDataComponent} />
      <Button type="submit" />
    </Form>
  );
}

export default reduxForm({
  form: 'benform'
})(beneForm);
