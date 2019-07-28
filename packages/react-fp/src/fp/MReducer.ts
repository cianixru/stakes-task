import {assocPath, lens,over, identity, path, reduce} from 'ramda'
import FSA from '@sha/fsa'

type EmptyState = {}
// Cause of type: string
type EmptyAction = {}

type Action = {
    type: string
}

type Reducer<S, A = EmptyAction>  = (state: Partial<S>, action: A) => Partial<S>

const arrify = <T>(val: T | T[]) : T[]  =>
    (val === null || val === undefined)
        ? []
        : (Array.isArray(val) ? val : [val])

const reduceReducers = (...reducers) =>
    (state, action) =>
        reduce((state, r: Reducer<any, any>) => r(state, action), state, state)


type ReducerBoxType<S, A> = {
    valueOf: () => Reducer<S, A>
    concat: <S1, A1> (other: ReducerBoxType<S1, A1>) => ReducerBoxType<S & S1, A | A1>
}

const ReducerBox = <S = EmptyState, A = EmptyAction>(f: Reducer<S, A> = identity) : ReducerBoxType<S, A> => ({
    valueOf: () => f,
    concat: <S1, A1>(g: ReducerBoxType<S1, A1>) : ReducerBoxType<S & S1, A | A1>  =>
        ReducerBox(reduceReducers([g.valueOf(), f]) as Reducer<S & S1, A | A1>)
   
})

type IncAction = { type: 'inc' }
type ConcatAction = { type: 'concat' }

const makeLens = (prop: string | string[]) =>
    lens(path(arrify(prop)), assocPath(arrify(prop)))


const num = makeLens('num')
const log = makeLens('log')

const reduceIncs: Reducer<{num: number}, IncAction> =
    (state, action) =>
        action.type === 'inc'
            ? over(num, x => x + 1, state)
            : state

const reduceMult: Reducer<{num: number}, IncAction> =
    (state, action) =>
        action.type === 'inc'
            ? over(num, x => x * 2, state)
            : state

const reduceLog: Reducer<{log: string}, ConcatAction | IncAction> =
    (state, action) =>
        over(log, (s = '') => s + action.type + ' \n', state)


const r = ReducerBox(reduceIncs)
                .concat(ReducerBox(reduceIncs))
                .concat(ReducerBox(reduceLog))
                .valueOf()

console.log(r({log}, {type: 'concat'}))   // state and action types are inferred correctly


