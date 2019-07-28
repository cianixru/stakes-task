import { ExtractAction } from './ExtractAction'
import uuid from 'uuid/v4'
export * from './ExtractAction'

export const factoryDelimeter = '/'

export interface FactoryAction<P> {
  type: string
  payload: P
  error?: boolean
  meta?: {} | any | null
  guid: string
}

export type FactoryAnyAction = FactoryAction<any>

export type ActionSelector<P> = (
  action: FactoryAction<P>,
) => action is FactoryAction<P>

export type IConsumer<I, A, O = I> = (state: I, action: A) => O

export const reducerFactory = <I, P, O>(
  reducer: IConsumer<I, FactoryAction<P>, O>,
) => (selector: ActionSelector<P>) => (state: I, action: FactoryAction<P>): O =>
  selector(action) ? reducer(state, action) : ((state as any) as O)

export interface Success<P, S> {
  params?: P
  result: S
}

export interface Failure<P, E = any> {
  params?: P
  error: E
}

export const isType = <P>(
  actionCreator: ActionCreator<P> | EmptyActionCreator,
) => {
    if (!actionCreator)
      debugger

    return () => (action: FactoryAnyAction): action is FactoryAction<P> =>
      action.type === actionCreator['type']
}

export const isTypeOfAny = <P>(actionCreator: Array<ActionCreator<P>>) => (
  action: FactoryAnyAction,
): action is FactoryAction<P> =>
  actionCreator.some(creator => creator.type === action.type)

export const isHasCreatorFactory = (
  acf: any,
): acf is { factory: ActionCreatorFactory } => acf && acf['factory']

export const isNamespace = (
  actionFactory: ActionCreatorFactory | { factory: ActionCreatorFactory },
) => (action: FactoryAnyAction) =>
  isHasCreatorFactory(actionFactory)
    ? action.type.startsWith(actionFactory.factory.base)
    : action.type.startsWith(actionFactory.base)

export interface ActionCreator<P> {
  type: string
  isType: (action: any) => action is FactoryAction<P>
  example: FactoryAction<P>
  handler: (payload: P) => any
  payloadReducer: ReducerBuilder<P, P>
  reduce: <I, A, O>(reducer: IConsumer<I, A, O>) => IConsumer<I, A, O>
  (payload: P, meta?: any | null): FactoryAction<P>
}

export type EmptyActionCreator = (
  payload?: undefined,
  meta?: any | null,
) => ActionCreator<undefined>

export type AsyncStatus = 'started' | 'done' | 'failed' | 'unset' | undefined

export type WithStatus<K extends string = 'asyncStatus'> = {
  [key in K]: AsyncStatus
}

export type AsyncActionCreators<P, S, E = any> = {
  type: string
  unset: EmptyActionCreator
  started: ActionCreator<P>
  done: ActionCreator<Success<P, S>>
  failed: ActionCreator<Failure<P, E>>
  defautlState: AsyncState<S, P, E>
  asyncReducer: ReducerBuilder<AsyncState<S, P, E>, AsyncState<S, P, E>>
}

export interface EmptySuccess<S> {
  result: S
}

export interface EmptyFailure<E> {
  error: E
}

export interface EmptyAsyncActionCreators<S, E> {
  type: string
  unset: EmptyActionCreator
  started: EmptyActionCreator
  done: ActionCreator<EmptySuccess<S>>
  failed: ActionCreator<EmptyFailure<E>>
}

export interface ActionCreatorFactory {
  (type: string, commonMeta?: any, error?: boolean): EmptyActionCreator

  <P>(
    type: string,
    commonMeta?: any,
    isError?: (payload: P) => boolean | boolean,
  ): ActionCreator<P>

  base: string

  async<P, S = undefined>(type: string, commonMeta?: any): AsyncActionCreators<P, S, any>

  async<undefined, S, E>(
    type: string,
    commonMeta?: any,
  ): EmptyAsyncActionCreators<S, E>

  async<P, S, E>(type: string, commonMeta?: any): AsyncActionCreators<P, S, E>
}

declare const process: {
  env: {
    NODE_ENV?: string;
  };
}

export type AsyncState<S, P = any, E = string> = {
  status: AsyncStatus | undefined;
  params: P | undefined;
  value: S | undefined;
  error: E | undefined;
}

export function actionCreatorFactory(
  prefix?: string | null,
  factoryMeta: {} = {},
  defaultIsError = (p: any) => p instanceof Error,
): ActionCreatorFactory {
  const actionTypes: { [type: string]: boolean } = {}

  const base = prefix ? `${prefix}${factoryDelimeter}` : ''

  function actionCreator<P = undefined>(
    type: string,
    commonMeta?: {} | null,
    isError: ((payload: P) => boolean) | boolean = defaultIsError,
  ): ActionCreator<P> {
    const fullType = base + type

    if (process.env.NODE_ENV !== 'production') {
      if (actionTypes[fullType])
        throw new Error(`Duplicate action types   : ${fullType}`)

      actionTypes[fullType] = true
    }
    const creator = Object.assign(
      (payload: P, meta?: {} | null) => {
        const action: FactoryAction<P> = {
          type: fullType,
          guid: uuid(),
          payload,
        }

        if (commonMeta || meta || factoryMeta)
          action.meta = Object.assign({stackTrace: new Error().stack}, factoryMeta, commonMeta, meta)

        if (isError && (typeof isError === 'boolean' || isError(payload)))
          action.error = true

        return action
      },
      {
        reduce: <I, O = I>(
          f: IConsumer<I, FactoryAction<P>, O>,
        ): IConsumer<I, FactoryAction<P>, O> => f,
        type: fullType,
        base,
      },
    )

    const reduce = <I, O>(reducer: IConsumer<I, FactoryAction<P>, O>) =>
      // @ts-ignore
      reducerFactory(reducer)(isType((creator as any) as ActionCreator<P>))

    const isType = (action: any) => action.type && action.type === fullType
    const handler = (payload: P): any => ({})

    const result = Object.assign(
      creator,
      { example: ({} as any) as FactoryAction<P> },
      {
        reduce,
        handler,
        isType,
        payloadReducer: (_ = {}, action: any) => {
          return isType(action) ? action.payload : _
        },
      },
    )

    return (result as any) as ActionCreator<P>
  }

  function asyncActionCreators<P, S, E>(
    type: string,
    commonMeta?: {} | null,
  ): AsyncActionCreators<P, S, E> {
    const started = actionCreator<P>(`${type}_STARTED`, commonMeta, false)
    const done = actionCreator<Success<P, S>>(
      `${type}_DONE`,
      commonMeta,
      false,
    )
    const failed = actionCreator<Failure<P, E>>(
      `${type}_FAILED`,
      commonMeta,
      true,
    )
    const unset = (actionCreator(
      `${type}_EMPTY`,
      commonMeta,
      false,
    ) as any) as EmptyActionCreator


    const defaultState = {
      value: undefined,
      error: undefined,
      status: undefined,
      params: {},
    }
    return {
      type: base + type,
      started,
      defaultState,
      done,
      failed,
      unset,
      asyncReducer: reducerWithInitialState((defaultState) as AsyncState<S, P, E>)
        .case(started, (state, payload) => ({
          value: undefined,
          error: undefined,
          status: 'started',
          params: payload,
        }))
        .case(done, (state, payload) => {
          return {
            value: payload.result,
            error: undefined,
            status: 'done',
            params: payload.params,
          }
        })
        .case(failed, (state, payload) => ({
          value: undefined,
          error: payload.error,
          status: 'failed',
          params: payload.params,
        }))
        .case(unset, _ => ({
          value: undefined,
          error: undefined,
          status: undefined,
          params: undefined,
        })),
    }
  }

  return (Object.assign(actionCreator, {
    async: asyncActionCreators,
    base,
  }) as any) as ActionCreatorFactory
}

export interface ReducerBuilder<InS extends OutS, OutS> {
  case<P>(
    actionCreator: ActionCreator<P> | EmptyActionCreator,
    handler: Handler<InS, OutS, P>,
  ): ReducerBuilder<InS, OutS>

  (state: InS, action: FactoryAnyAction): OutS
}

export type Handler<InS extends OutS, OutS, P> = (
  state: InS,
  payload: P,
) => OutS

export function reducerWithInitialState<S>(
  initialValue: S,
): ReducerBuilder<S, S> {
  return makeReducer<S, S>([], initialValue)
}

export function reducerWithoutInitialState<S>(): ReducerBuilder<S, S> {
  return makeReducer<S, S>([])
}

export function upcastingReducer<InS extends OutS, OutS>(): ReducerBuilder<
  InS,
  OutS
> {
  return makeReducer<InS, OutS>([])
}

interface Case<InS extends OutS, OutS, P extends {}> {
  actionCreator: ActionCreator<P>
  handler: Handler<InS, OutS, P>
}

function makeReducer<InS extends OutS, OutS>(
  cases: Array<Case<InS, OutS, any>>,
  initialValue?: InS,
): ReducerBuilder<InS, OutS> {
  const reducer = ((
    state: InS = initialValue as InS,
    action: FactoryAnyAction,
  ): OutS => {
    for (let i = 0, length = cases.length; i < length; i++) {
      const { actionCreator, handler } = cases[i]
      if (actionCreator.isType(action))
        return Array.isArray(state)
          ? handler(state, action.payload)
          : Object.assign({}, { ...(handler(state, action.payload) as any) })
    }
    return state
  }) as ReducerBuilder<InS, OutS>

  // @ts-ignore
  reducer.case = <P>(
    actionCreator: ActionCreator<P>,
    handler: Handler<InS, OutS, P>,
  ): ReducerBuilder<InS, OutS> => {
    return makeReducer([...cases, { actionCreator, handler }], initialValue)
  }

  return reducer
}
