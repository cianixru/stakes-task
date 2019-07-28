import {assocPath, lens, over, identity, path, reduce, curry, partial} from 'ramda'

export type IConsumer<In, Action, Out = In> =
    (state: Partial<In>, action: Action) => Partial<Out & In>


const arrify = <T>(val: T | T[]): T[]  =>
    (val === null || val === undefined)
        ? []
        : (Array.isArray(val) ? val : [val])

const reduceProducers = (...reducers) =>
    (previous, current) =>
        reducers.reduce(
            (p, r) => r(p, current),
            previous
        )


type E = {}


const idMorphism: IConsumer<E, E, E> = (state: E, action: E) => state


const concat = <I1, A1, O1, I2, A2, O2>
    (
            f: IConsumer<I1, A1, O1>,
            g: IConsumer<I2, A2, O2>
    )
    : IConsumer<Partial<I1 & I2>, A1 | A2, Partial<O1 & O2>> =>
        reduceProducers( f, g)

export const concatR = concat


export const Consumer = <I1, A1, O1>(f: IConsumer<I1, A1, O1> = idMorphism as any as IConsumer<I1, A1, O1> ) =>
    Object.assign(
        f,
        {
            valueOf: (): IConsumer<I1, A1, O1>  => f,
            concat: <I2, A2, O2>(g: IConsumer<I2, A2, O2>): IConsumer<I1 & Partial<I2>, A1 | A2, Partial<O1 & O2>> =>
                Consumer(concat(f, g)),

            //callIf: <I2, A2, O2>(g: IConsumer<I2, A2, O2>) : IConsumer<I1, A1, O1, I2, A =>

        }
    )

type IncAction = { type: 'inc' }
type ConcatAction = { type: 'concat' }

export const makeLens = <T, U = any>(prop: string | string[]) =>
    lens<T, U, T | U>(path(arrify(prop)), assocPath(arrify(prop)))


const num = makeLens('num')
const log = makeLens('log')




export const overLens = (prop: string | string[], transform) =>
    over(
        lens(
            path(arrify(prop)),
            assocPath(arrify(prop))
        ),
        transform
    )

