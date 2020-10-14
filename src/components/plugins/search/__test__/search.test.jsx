import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SearchBar } from "..";

Enzyme.configure({ adapter: new Adapter() });

const buildFakeProps = () => ({
  matchCount: 10,
  columns: [
    {
      dataIndex: "tagColumn1",
      name: "Tag Column 1",
    },
    {
      dataIndex: "tagColumn2",
      name: "Tag Column 2",
    },
  ],
  gridData: [],
});

describe("Search", () => {
  it("renders correctly", () => {
    const targetComponent = shallow(<SearchBar {...buildFakeProps()} />);
    expect(targetComponent).toBeDefined();
  });

  it("filters when the input changes", () => {
    const filter = jest.fn();
    const targetComponent = mount(<SearchBar {...buildFakeProps()} filter={filter} />);

    targetComponent.find("input").simulate("change", { target: { value: "test" } });

    expect(filter).toHaveBeenCalled();
  });
});
