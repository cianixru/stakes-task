type Reducer<S, A> = (state: S, action: A) => S

export type ExtractAction<R = Reducer<S, A>, S = undefined, A = undefined> = A
