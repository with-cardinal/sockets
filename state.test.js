const state = require("./state");

const SET_NAME = Symbol("SET_NAME");

function reduce(prev, action, payload) {
  switch (action) {
    case SET_NAME:
      return { name: payload.name };
  }

  return prev;
}

describe("state", () => {
  test("basic state change", () => {
    const dispatch = state({ name: null }, reduce);

    const newState = dispatch(SET_NAME, { name: "Me" });
    expect(newState.name).toEqual("Me");
  });
});
