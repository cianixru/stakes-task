import { Action, applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { isFrontend } from '../../../utils/src'
import createRootReducer from './reducer'

import { routerMiddleware, getBrowserHistory } from '../../../router'
import { FactoryAnyAction } from '../../../fsa/src'

const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'

const configureFrontendStore = (
  initialState?: any,
  historyInstance: ReturnType<typeof getBrowserHistory> = getBrowserHistory()
) => {

  const store = createStore(createRootReducer(historyInstance), initialState, getFrontEndMiddleware(historyInstance))

  store['runSaga'] = sagaMiddleware.run
  const dispatch = store.dispatch
  let prevRoute = '?'

  // @ts-ignore
  store['dispatch'] = (action: FactoryAnyAction) => {
    if (!action) return

    if (action && action.type === '@@router/LOCATION_CHANGE')  {
      if ( prevRoute !== action.payload.location.pathname) {
        prevRoute = action.payload.location.pathname
        dispatch(action)
      }
    } else {
      dispatch(action)
    }
  }
  singletonFrontendStore = store
  return store as typeof store & { runSaga: Function, history: any }
}

export let singletonFrontendStore

const sagaMiddleware = createSagaMiddleware()

const getFrontEndMiddleware = (history: any) =>
  isFrontend() && window[REDUX_DEV_TOOLS]
    ?
    compose(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
      window[REDUX_DEV_TOOLS](),
    )
    :
    compose(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
    )

export default configureFrontendStore
