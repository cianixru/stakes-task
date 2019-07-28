import { match, matchPath } from 'react-router'
import { LOCATION_CHANGE, RouterActionType} from 'connected-react-router'
export * from 'connected-react-router'
export * from 'react-router'
import { createBrowserHistory, createMemoryHistory } from 'history'
import {isFrontend} from '@sha/utils'
import { ActionCreator, FactoryAnyAction } from '@sha/fsa'
import { put, takeLatest, select } from 'redux-saga/effects'
export const history = isFrontend()
    ? createBrowserHistory()
    : createMemoryHistory()

export const getBrowserHistory = () => history

const makeRoute = <T extends { [K in keyof T]?: string }>(pattern: string): NavRoute<T> => {
  const creator = (props: T = {} as any as T): string =>
    Object
      .entries(props)
      .reduce(
        (result, [key, value]) =>
          result.replace(':' + key, String(value)),
        pattern,
      )

  const matchParams = (path: string, options: match<T> = {isExact: true} as any as match<T>): match<T> | null => {
    const result = matchPath<T>(path, {
      path: pattern,
      ...options,
    })
    return result
  }
  return Object.assign(
    creator,
    {
      match: matchParams,
      pattern,
      isType: (action: any, isExact: boolean = true): action is LocationAction<T> =>
        action.type.includes(LOCATION_CHANGE) &&
        action.payload &&
        action.payload.location &&
        action.payload.location.pathname &&
        action.payload.location.pathname !== null &&
        action.payload.location.pathname !== undefined &&
        matchParams(action.payload.location.pathname) &&
        (
          isExact ? matchParams(action.payload.location.pathname).isExact === true : true
        ),
    },
  )
}

export type RouteCreator<T> = (props?: T) => string

export type NavRoute<T> =
  RouteCreator<T>
  & {
  pattern: string
  match: (path: string, options?: match<T>) => match<T> | null
  isType: (value: any, isExact?: boolean) => value is LocationAction<T>
}

export type HistoryAction = RouterActionType

export type LocationAction<T = undefined> = {
  type: string,
  payload: {
    location: {
      pathname: string
    }
    params: T
    recordToHistory?: boolean
    action: HistoryAction
  }
}

export const isLocation = <T>(route?: NavRoute<T>, isExact = true) => (action: any): action is LocationAction<T> =>
  route
    ? route.isType(action, isExact)
    : action.type.includes(LOCATION_CHANGE)

export const push = <T>(route: NavRoute<T>) => (params: T = {} as any as T) => ({
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname: route(params),
    },
    params,
    pattern: route.pattern,
    action: 'PUSH',
    // recordToHistory: true,
  },
})
export const pushPathname = <T>(pathname: string) => ({
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname,
    },
    action: 'PUSH',
    // recordToHistory: true,
  },
})
export {
  LOCATION_CHANGE, RouterActionType, match, matchPath, makeRoute
}





export function* dispatchOnRouteSaga<T, P>(nav: NavRoute<T>, actionCreatorToDispatch: ActionCreator<P>, isExact = false) {

  let lastMatched = false

  function* worker(action) {
    const params = nav.match(action.payload.location.pathname)!.params
    // @ts-ignore
    yield put(actionCreatorToDispatch(params))
  }

  // @ts-ignore
  yield takeLatest( (action: FactoryAnyAction) => {

      const result = isLocation(nav, isExact)(action)

      if (result && !lastMatched) {
        lastMatched = true
        return result
      }

      if (!result && lastMatched && action.type.includes(LOCATION_CHANGE))
        lastMatched = false

      return false
    },
    worker,
  )

}
