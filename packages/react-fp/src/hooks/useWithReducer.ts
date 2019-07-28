import React, { Reducer } from 'react'
import { Omit } from 'utility-types'

export type WithReducerProps<S, A> = {
    dispatch: (action: A) => any
    state: S
}

type K = 'state' | 'dispatch'

const useWithReducer = <S, A>(reducer: Reducer<S, A>, defaultState: S) => <P extends WithReducerProps<S, A>>(
    Component: React.ComponentType<P>,
) =>
    (((props: P) => {
        const [state, dispatch] = React.useReducer(
            reducer,
            props.state || defaultState,
        )
        return React.createElement(Component, {state, dispatch, ...props})
    }) as any) as React.FunctionComponent<Omit<P, K> & { [key in K]?: P[K] }>

export default useWithReducer
