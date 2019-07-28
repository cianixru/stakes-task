let noopSymbol = Symbol()

let noop = {
    [noopSymbol]: true
}

type CallPredicate <T> = (value: T) => boolean
type Callable<I> = (value: I) => I


export const CallIf =
    <T>(predicate: CallPredicate<T> = _ => true) =>
        Object.assign(
            <O>(fnc: Callable<T>) =>
                (value: T): T =>
                    !predicate(value as T)
                        ? value
                        : fnc(value as T),
            {
                valueOf: () => predicate,

                and: (f: CallPredicate<T>) =>
                    CallIf((value: T) => predicate(value) && f(value)),

                or: (f: CallPredicate<T>) =>
                    CallIf((value: T) => predicate(value) || f(value))
            }
        )

/**
 * <example>
 *     const trace = (d: number) =>
 *      console.log(d)
 *
 *     const only10to15 = CallIf(R.gt(10)).ap(R.lt(15)).fold
 *     const trace10to15 = only10to15(trace)
 *
 *      trace10to15(8) // nothing in console
 *      trace10to15(12) // 12
 *      trace10to15(16) // nothing in console
 * </example>
 */
