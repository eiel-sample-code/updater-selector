import React from "react";

type Selector<State, View> = (state: State) => View
type Props = { message: string };

const StatelessComponent =
    ({ message }: Props): React.ReactElement<Props> => {
        return (
            <div>{message}</div>
        );
    };

// 型チェックしたいだけ
// eslint-disable-next-line
const _: Selector<Props, React.ReactElement<Props>> = StatelessComponent;
