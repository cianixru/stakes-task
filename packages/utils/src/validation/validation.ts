export type Predicate<T> = (value: T) => boolean

export type Validator<T> = [Predicate<T>, string, boolean]

export const validation = <T>(validators: Validator<T>[] = []) => {
  const add = (predicate: Predicate<T>, errorString: string = 'Error', debug: boolean = false) =>
    validation([...validators, [predicate, errorString, debug]])

  const run = function(value: T): [boolean, string[]] {
    const errors = []

    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i]
      if (validator[2])
        debugger
      if (validator[0](value))
        return [false, [validator[1]]]
    }

    return [true, errors]
  }
  return Object.assign(run, {add})
}
