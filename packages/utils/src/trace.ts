import { curry } from 'ramda'
/**
 * Tap function to test incoming auments and the result of a function call
 *
 * <example>
 *     const fnc = (a, b) => a + b
 *     const tracedSum = trace('sum call', 'log')
 *     tracedSum(fnc)(2, 3)
 *     // console outputs :  sum call, fnc,
 *     // ARGS: 2, 3
 *     // RESULT: 5
 *
 * </example>
 */

type TraceLevel =
  | 'log'
  | 'debug'
  | 'warn'
  | 'error'
  | 'info'
  | 'debugger interrop'

export default curry(
  <T = undefined>(
    message: string = 'trace call',
    traceLevel: TraceLevel = 'log',
    f: (...params: any[]) => T,
  ) => (...args): T => {
    const time = new Date().valueOf()

    if (traceLevel === 'debugger interrop') debugger

    const result = f(...args)
    const elapsedTime = new Date().valueOf() - time

    console[traceLevel](
      '\n',
      message,
      'function ' + f.name,
      'elapsedTime ' + elapsedTime,
      '\n',
      ...args,
      '\n => ',
      '\n',
      result,
    )
    return result
  },
)

/*
const tapToLog = <F extends Function>(f: F) => (
    (...args) => {
        const result = f(...args)
        console.log('Evaluate', f.name, args, result)
        return result
    }
) as any as F


const tapToLogIfFunction = <T>(value: T): T =>
    value instanceof Function
        ? tapToLog(value)
        : value

const logify = <T>(obj: T) =>
    Object.entries(obj).reduce(
        (result, [key, value]) => ({
            ...result,
            [key]: tapToLogIfFunction(value)
        }),
        {}
    )

const result = logify(obj)


type Class<T = {}> = {
    new (...args: any[]): T
    prototype: T
    staticProp: 'abc'
}


const a = {
    b: 5,
    c: a
}

type Mixin<A extends Class<{}>, B extends Class<{}>> = (base: A) => B

const ClassBuilder = <A extends Class<{}>>(Base: A) =>
    Object.assign(Base, {
        map: <B extends Class<{}>>(mixin: Mixin<A, B>) =>
            ClassBuilder(mixin(Base))
    })

class AClass {
    constructor(props) {
        super(props)
    }
    a = () => true
    b = () => this.constructor['d']
    static d = 6
}

const mixinB = <T extends Class<{}>>(Base: T) =>
    class extends Base {
        b = () => 'b'
    }

const mixinC = <T extends Class<{}>>(Base: T) =>
    class extends Base {
        c = () => 'c'
    }


type Foo<T, B> =    ThisType<B>

const ABC = ClassBuilder(AClass)
                .map(mixinB)
                .map(mixinC)

class Next extends ABC {}

(new Next()).c


type A = {a: number

}
interface N {
    static A: number
}
type Nominal<T, Tag extends string> = T & {readonly tag?: Tag}
type NominalA = Nominal<A, 'a'>

const pureA: A = {a: 1}
let nominalA: NominalA = {a: 4}
let nominalB: NominalA = {a: 4}
pureA = nominalA
nominalA = nominalB
nominalA = pureA
*/
