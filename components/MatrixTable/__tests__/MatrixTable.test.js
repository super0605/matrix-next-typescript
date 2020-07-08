import React from "react";
import { mount, shallow } from "enzyme";
import MatrixTable from "../index";

// jest.mock("@history", () => ({
//   push: jest.fn(),
// }));

// jest.mock("@lodash", () => ({
//   merge: jest.fn(),
// }));

// jest.mock("i18next", () => ({
//   addResourceBundle: jest.fn(),
// }));

// jest.mock("app/store", () => ({
//   injectReducer: jest.fn(),
// }));

jest.mock("react-redux", () => ({
  useContext: jest.fn(),
  // useSelector: jest.fn().mockReturnValueOnce("mockFuseState"),
}));

describe("MatrixTable", () => {
  let props;
  let mountedMatrixTable;
  let wrapper;

  const renderWrapper = (bShallow) => {
    if (!mountedMatrixTable) {
      mountedMatrixTable = bShallow
        ? shallow(<MatrixTable {...props} />)
        : mount(<MatrixTable {...props} />);
    }
    return mountedMatrixTable;
  };

  beforeEach(() => {
    props = {};

    wrapper = renderWrapper(true);
  });

  it("should render without problems", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
