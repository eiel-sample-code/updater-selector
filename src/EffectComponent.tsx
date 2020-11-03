import React from 'react';

type LifeCycle = "unmounted" | "mounted";
type Scope = { timer: ReturnType<typeof setTimeout> | null, update: Update };
type State = [string, LifeCycle, Scope]
type Action = "mount" | "click" | "timeout" | "unmount"
type Effect = () => void;
type Updater = (state: State, action: Action) => [State, Effect];
type Selector<A> = (state: State) => A;
type Update = (action: Action) => void;


const second = 1000;

const updater = (state: State, action: Action): [State, Effect] => {
  const [message, lifeCycle, scope] = state
  switch (action) {
    case "mount": {
      if (lifeCycle === "unmounted") {
        return [[message, "mounted", scope],
          () => {
            scope.timer = setTimeout(() => {
              scope.update("timeout");
            }, 5 * second);
          }]
      }
      return [state, () => {}];
    }
    case "unmount": {
      return [["", "unmounted", scope], () => {
        if (scope.timer) {
          clearTimeout(scope.timer);
          scope.timer = null;
        }
      }];
    }
    case "click": return [
      ["こんにちはー", lifeCycle, scope], () => {
        if (scope.timer) {
          clearTimeout(scope.timer)
          scope.timer = null;
        }
      }
    ]
    case "timeout": return [
      ["まだクリックしてくれないんですか?", lifeCycle, scope], () => {}
    ]
  }
}
const selector: Selector<React.ReactElement> =
    ([message]: State) => <div>{message}</div>;

const updateFactory = (_updater: Updater, [state, setState]: [State, (state: State) => void]) => (action: Action) => {
  const [newState, effect] = _updater(state, action);
  effect();
  setState(newState);
}

const useUpdate = (_updater: Updater, initial: State): [State, Update] => {
  const store = React.useState(initial);
  const update: Update = updateFactory(_updater, store)
  React.useEffect(() => {
    update("mount");
    return () => update("unmount");
    // Reactのライフサイクルと同期をとりたい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [state] = store;

  return [
    state,
    update,
  ];
}

const initialState: State = ["", "unmounted", { timer: null, update: () => {} }];

const EffectComponent: React.FunctionComponent = () => {
  const [state, update] = useUpdate(updater, initialState);
  const [,,scope] = state;
  scope.update = update;
  const handleClick = () => {
    update("click");
  }

  return (
      <>
        <button onClick={handleClick}>クリックしてね</button>
        {selector(state)}
      </>
  );
}

export default EffectComponent;
