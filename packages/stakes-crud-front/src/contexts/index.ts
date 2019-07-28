import React from 'react'
import { identity } from 'ramda'
import { now } from '@sha/utils'
import {getBrowserHistory} from '@sha/router'

const defaultValues = new Map<React.Context<any>, any>()

export const createAdvancedContext = <T>(defaultValue: T = undefined) => {
    const context = React.createContext(defaultValue)
    defaultValues.set(context, defaultValue)
    return Object.assign(context, {
        subscribe: <R = T>(selector: (value: T) => R = identity as any) =>
            useSubscribe(context, selector),
    })
}

export const useSubscribe = <T, R = T>(
    context: React.Context<T>,
    selector: (value: T) => R = identity as any,
) => {
    const value = React.useContext(context)
    /*
      if (value === defaultValues.get(context))
        console.warn(
          'No Provider for context ',
          context,
          'default value used instead',
          value,
        )
    */
    return selector(value)
}

export const DisabledContext = createAdvancedContext(false)

export const NowContext = createAdvancedContext(now())

export const HistoryContext = createAdvancedContext(getBrowserHistory())

export const SearchContext = createAdvancedContext('')
