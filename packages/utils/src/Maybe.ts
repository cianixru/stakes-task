export default class Maybe<T> {
  private constructor(private value: T | undefined) {}

  static some<T>(value: T) {
    if (value === undefined) {
      throw Error('Provided value must not be empty')
    }
    return new Maybe(value)
  }

  static none<T>() {
    return new Maybe<T>(undefined)
  }

  static fromValue<T>(value: T) {
    return (value !== undefined) ? Maybe.some(value) : Maybe.none<T>();
  }

  static run<R>(gen: IterableIterator<Maybe<R>>): Maybe<R> {
    function step(value?) {
      const result = gen.next(value);
      if (result.done) {
        return result.value;
      }
      return result.value.flatMap(step);
    }
    return step();
  }

  map<R>(f: (wrapped: T) => R): Maybe<R> {
    if (this.value === undefined || this.value == null) {
      return Maybe.none<R>()
    } else {
      let result
      try {
        result = f(this.value)
      } catch(e) {
        result = undefined
      }
      return result !== undefined ? Maybe.some(result) : Maybe.none<R>();
    }
  }

  flatMap<R>(f: (wrapped: T) => Maybe<R>): Maybe<R> {
    if (this.value === undefined) {
      return Maybe.none<R>();
    } else {
      return f(this.value);
    }
  }

  getOrElse(defaultValue: T) {
    return this.value === undefined ? defaultValue : this.value;
  }
}
