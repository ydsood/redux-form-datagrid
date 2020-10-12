// @flow

import React from "react";
import { createUseStyles } from "react-jss";

import SearchBarImpl from "./SearchBar";
import type { SearchBarProps } from "./SearchBar";
import { searchBarStyles } from "./styles";

const SearchBar = (props: SearchBarProps) => (
  <SearchBarImpl {...props} classes={createUseStyles(searchBarStyles)()} />
);

SearchBar.defaultProps = {
  matchCount: 5,
};

export {
  SearchBar,
};

export type {
  SearchBarProps,
};
