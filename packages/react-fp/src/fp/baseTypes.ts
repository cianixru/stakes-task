
export type Action = {
    type: string
}

export type KeyOf<T> = keyof T

export type KeyedMap<V, T> = {
    [P in keyof Partial<T>] : V
}

