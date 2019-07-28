import { AnyAction } from 'redux'
import { $Values } from 'utility-types'

export type AnyReducer = (state: any, action: any) => any

export type TypedReducer<S, A = AnyAction> = (state: S, action: A) => S

type ActionByReducer<S, A, R = TypedReducer<S, A>> = A

type Duck<S, A> = (as: any[]) => { reducer: TypedReducer<S, A> }

type DeepReadonly<T> = T extends any[]
    ? DeepReadonlyArray<T[number]>
    : T extends object
        ? DeepReadonlyObject<T>
        : T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

export type ExtractState<T> = T extends AnyReducer
    ? ReturnType<T>
    : T extends { reducer: AnyReducer }
        ? ReturnType<T['reducer']>
        : T extends Duck<infer S, infer A>
            ? S
            : T

export type ExtractAction<T> = T extends TypedReducer<infer S, infer A>
    ? ActionByReducer<S, A, TypedReducer<S, A>>
    : T extends { reducer: TypedReducer<infer S, infer A> }
        ? ActionByReducer<S, A, TypedReducer<S, A>>
        : T extends Duck<infer S, infer A>
            ? A
            : T

type ActionCreator<P> = (payload: P, ...as: any[]) => { type: any; payload: P }

type ActionCreatorMap<M, T, P> = { [K in keyof M]: ActionCreator<P> }

export type ExtractActionByFactory<M> = M extends ActionCreatorMap<M, infer T, infer P>
    ? $Values<ActionCreatorMap<M, T, P>>
    : AnyAction
