export class Counter {
    constructor(private value = 0) {
        this.value = value;
    }

    increment() {
        this.value++;
        console.log(this.humanize());
    }

    decrement() {
        this.value--;
        console.log(this.humanize());
    }

    humanize() {
        return `${this.value}回`
    }
}
type State = {
    value: number;
}
// アクションの種類
type Action = "increment" | "decrement";
type Effect = () => void;
type Updater<State, Action> = (state: State, action: Action) => [State, Effect];
type Selector<State, View> = (state: State) => View;


const noop = () => {};

// Selector
const humanize: Selector<State, string> = state => `${state.value}回`;

// Updater
export const counterUpdater: Updater<State, Action> = (state = { value: 0 }, action) => {
    switch (action) {
        case "increment":
        {
            // stateが増えたときのことも考えとこうかな
            const newState = {...state, value: state.value + 1}
            return [newState, () => console.log(humanize(newState))];
        }
        case "decrement": {
            const newState = {...state, value: state.value - 1}
            return [newState, () => console.log(humanize(newState))];
        }
        default: return [state, noop];
    }
}

export interface CounterStore {
    increment: () => void;
    decrement: () => void;
    humanize: () => string;
}

export const createCounterStore: (updater: Updater<State, Action>) => CounterStore = (updater) => {
    // stateは変わるんや
    let state: State;
    // Updaterを評価して、stateを保持してeffectを実行する
    const update = (action: Action) => {
        const updated = updater(state, action);
        [state] = updated;
        const [,effect] = updated;
        effect();
    }
    // 便利メソッドも生やしておこう
    return {
        increment: () => update('increment'),
        decrement: () => update('decrement'),
        humanize: () => humanize(state),
    }
}
