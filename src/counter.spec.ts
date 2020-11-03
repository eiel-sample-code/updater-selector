import {Counter, counterUpdater, createCounterStore} from "./counter";

const counterUseCase = (counter: CounterStore): void => {
    counter.increment();
    counter.increment();
    counter.decrement();
    expect(counter.humanize()).toBe("1回");
}

it("Counter", () => {
    const counter = new Counter()
    counterUseCase(counter);
    expect(counter.humanize()).toBe("1回");
});

it("CounterStore", () => {
    const counter = createCounterStore(counterUpdater)
    counterUseCase(counter);
    expect(counter.humanize()).toBe("1回");
});
