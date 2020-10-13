function state(init, reducer) {
  let internalState = init;

  return (action, payload) => {
    internalState = reducer(internalState, action, payload);
    return internalState;
  };
}

module.exports = state;
