const {
  CONNECT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  UNSUBSCRIBE_SUBSCRIBED_TO,
  init,
  reducer,
} = require("./reducer");
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

  describe("SUBSCRIBE", () => {
    test("ignored when no matching client", () => {
      const dispatch = state(init(), reducer);
      const newState = dispatch(SUBSCRIBE, {
        clientId: "missing",
        channel: "noise",
      });

      expect(newState).toEqual({ clients: {}, subs: {} });
    });

    test("added when matching client", () => {
      const dispatch = state(init(), reducer);
      dispatch(CONNECT, {
        id: "testId",
        client: "testClient",
        ip: "testIp",
        timeout: "testTimeout",
      });

      const newState = dispatch(SUBSCRIBE, {
        clientId: "testId",
        channel: "noise",
      });

      expect(newState).toEqual({
        clients: {
          testId: {
            client: "testClient",
            ip: "testIp",
            timeout: "testTimeout",
            subs: ["noise"],
          },
        },
        subs: {
          noise: ["testId"],
        },
      });
    });
  });

  describe("UNSUBSCRIBE", () => {
    test("ignored when unknown client", () => {
      const initialState = {
        clients: {
          testId: {
            client: "testClient",
            ip: "testIp",
            timeout: "testTimeout",
            subs: ["noise"],
          },
        },
        subs: {
          noise: ["testId"],
        },
      };

      const dispatch = state(initialState, reducer);

      const newState = dispatch(UNSUBSCRIBE, {
        clientId: "missing",
        channel: "noise",
      });

      expect(newState).toEqual(initialState);
    });

    test("ignored when unknown channel", () => {
      const initialState = {
        clients: {
          testId: {
            client: "testClient",
            ip: "testIp",
            timeout: "testTimeout",
            subs: ["noise"],
          },
        },
        subs: {
          noise: ["testId"],
        },
      };

      const dispatch = state(initialState, reducer);

      const newState = dispatch(UNSUBSCRIBE, {
        clientId: "testId",
        channel: "missing",
      });

      expect(newState).toEqual(initialState);
    });

    test("removes sub", () => {
      const initialState = {
        clients: {
          testId: {
            client: "testClient",
            ip: "testIp",
            timeout: "testTimeout",
            subs: ["noise"],
          },
        },
        subs: {
          noise: ["testId"],
        },
      };

      const dispatch = state(initialState, reducer);

      const newState = dispatch(UNSUBSCRIBE, {
        clientId: "testId",
        channel: "noise",
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
        subs: {
          noise: [],
        },
      });
    });
  });
});
