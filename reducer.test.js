const {
  CONNECT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  UNSUBSCRIBE_SUBSCRIBED_TO,
  REMOVE_CLIENT,
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

    test("ignored when unknown client", () => {
      const dispatch = state(initialState, reducer);

      const newState = dispatch(UNSUBSCRIBE, {
        clientId: "missing",
        channel: "noise",
      });

      expect(newState).toEqual(initialState);
    });

    test("ignored when unknown channel", () => {
      const dispatch = state(initialState, reducer);

      const newState = dispatch(UNSUBSCRIBE, {
        clientId: "testId",
        channel: "missing",
      });

      expect(newState).toEqual(initialState);
    });

    test("removes sub", () => {
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

  describe("UNSUBSCRIBE_SUBSCRIBED_TO", () => {
    const initialState = {
      clients: {
        testId: {
          client: "testClient",
          ip: "testIp",
          timeout: "testTimeout",
          subs: ["noise", "racket"],
        },
      },
      subs: {
        noise: ["testId"],
        racket: ["testId"],
      },
    };

    test("ignores missing subscribedTo", () => {
      const dispatch = state(initialState, reducer);
      const newState = dispatch(UNSUBSCRIBE_SUBSCRIBED_TO, {
        subscribedTo: "missing",
        channel: "racket",
      });

      expect(newState).toEqual(initialState);
    });

    test("ignores missing channel", () => {
      const dispatch = state(initialState, reducer);
      const newState = dispatch(UNSUBSCRIBE_SUBSCRIBED_TO, {
        subscribedTo: "noise",
        channel: "missing",
      });

      expect(newState).toEqual(initialState);
    });

    test("unsubscribes", () => {
      const dispatch = state(initialState, reducer);
      const newState = dispatch(UNSUBSCRIBE_SUBSCRIBED_TO, {
        subscribedTo: "noise",
        channel: "racket",
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
          racket: [],
        },
      });
    });
  });

  describe("REMOVE_CLIENT", () => {
    const initialState = {
      clients: {
        testId: {
          client: "testClient",
          ip: "testIp",
          timeout: "testTimeout",
          subs: [],
        },
      },
      subs: {},
    };

    test("removes the client", () => {
      const dispatch = state(initialState, reducer);
      const newState = dispatch(REMOVE_CLIENT, { id: "testId" });
      expect(newState).toEqual({ clients: {}, subs: {} });
    });
  });
});
