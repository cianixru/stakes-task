export function tryTo<T>(func: () => T) {
    return {otherwise: (value: T): T => {
            try {
                return func()
            } catch (e) {
                console.error(e)
            }
            return value
        },
    }
}
