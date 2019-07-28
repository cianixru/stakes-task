import { combineReducers } from 'redux'
import { connectRouter, RouterState, getBrowserHistory } from '../../../router'
import { History } from 'history'
import { prepend, slice } from 'ramda'
import {AsyncState, FactoryAnyAction} from '../../../fsa/src'


type DeepReadonly<T> = T extends any[]
  ? DeepReadonlyArray<T[number]>
  : T extends object ? DeepReadonlyObject<T> : T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

const reducer = (history: History = getBrowserHistory()) => {
  const restStateReducer = combineReducers({
      router: connectRouter(history),

    },

  )

  const prevStateReducer = (state: FrontState = {} as FrontState, action: FactoryAnyAction): FrontState => {

    let prevStates = state.prevStates || []
    const restState = restStateReducer(state, action)
    return {...restState, prevStates}
  }

  return prevStateReducer
}




type AllState = {
  router: RouterState,
}

export type FrontState = AllState & {
  prevStates: AllState[]
}

export default reducer
