type Effect = () => void;
type AnyAction = { type: string }
type Reducer<State, Action extends AnyAction> = (state: State, action: Action) => State
type Updater<State, Action>                   = (state: State, action: Action) => [State, Effect]

const noop = () => {};
export const reducerToUpdater =
  <State, Action extends AnyAction>(reducer: Reducer<State, Action>): Updater<State, Action> => {
    return (state, action) => [reducer(state, action), noop]
  };


