import React, { Fragment } from "react";
import { Label } from "semantic-ui-react";

type Props = {
  label: String,
  value: String,
};

const SearchTagOption = ({
  label,
  value,
}: Props) => (
  <Fragment>
    <Label content={label} />
    {value}
  </Fragment>
);

export default SearchTagOption;
