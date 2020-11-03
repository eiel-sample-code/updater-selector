import {reducerToUpdater} from "./reducer";

it('reducerToUpdater', () => {
    const updater = reducerToUpdater<number, { type: 'null'}>(state => state+1);
    const [state] = updater(2, { type: 'null' })
    expect(state).toBe(3)
});
