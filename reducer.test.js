const { CONNECT, init, reducer } = require("./reducer");
const state = require("./state");

describe("reducer", () => {
  test("CONNECT", () => {
    const dispatch = state(init(), reducer);

    const newState = dispatch(CONNECT, {
      id: "testId",
      client: "testClient",
      ip: "testIp",
      timeout: "testTimeout",
    });

    expect(newState).toEqual({
      clients: {
        testId: {
          client: "testClient",
          ip: "testIp",
          timeout: "testTimeout",
          subs: [],
        },
      },
      subs: {},
    });
  });
});
