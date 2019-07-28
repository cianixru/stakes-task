import * as fsa from '../../../fsa/src'
import { append, equals, reject } from 'ramda'
import { combineReducers } from 'redux'
import { FactoryAnyAction } from '../../../fsa/src'


export type UIState = ReturnType<typeof reducer>

const factory = fsa.actionCreatorFactory('ui')

const actions = {
  busy: factory<any>('busy'),
  unbusy: factory<any>('unbusy'),

}

const busyReducers = (state: any[] = [], action: FactoryAnyAction): any[] => {
  if (actions.busy.isType(action))
    return append(action.payload, state)

  if (actions.unbusy.isType(action))
    // @ts-ignore
    return  reject(equals(action.payload), state)

  if (actions.unbusy.isType(action))
    // @ts-ignore
    return  reject(equals(action.payload), state)

  return state
}

const reducer = combineReducers({
  busy: busyReducers,

})


export const uiDuck = {
  actions,
  reducer,

}
