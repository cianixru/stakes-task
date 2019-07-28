import React, { ChangeEvent, ChangeEventHandler } from 'react'
import { Subtract } from 'utility-types'
import { Renderable } from './renderChildren'

type OptionalKeys<T, U extends keyof T> = Subtract<T, { [key in U]: T[U] }> &
  { [key in U]?: T[U] }

export type OnValueChangeHandler<T> = (value: T) => any | void

export const defaultOnValueChange = value => undefined

export type WithValueProps<T> = {
  value?: T
  onValueChange?: OnValueChangeHandler<T>
}

export type InputProps<T, D = T, M extends boolean = false> = WithValueProps<
  M extends true ? T[] : T
> & {
  data?: D[]
  label?: Renderable
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: string
  helperText?: string
}

export const onChangeHandler = <
  T = string,
  E extends HTMLElement = HTMLInputElement
>(
  onChange?: ChangeEventHandler<E>,
  onValue?: OnValueChangeHandler<T>,
  event?: ChangeEvent<E>,
) => {
  if (onChange) onChange(event)
  if (onValue) onValue(event.target['value'])
}
export const onCheckboxChangeHandler = (
  onChange?: ChangeEventHandler<HTMLInputElement>,
  onValue?: OnValueChangeHandler<boolean>,
  event?: ChangeEvent<HTMLInputElement>,
) => {
  if (onChange) onChange(event)
  if (onValue) onValue(event.target['checked'])
}

export const memoizedOnChange = <
  T = string,
  E extends HTMLElement = HTMLInputElement
>(
  onChange?: ChangeEventHandler<E>,
  onValueChange?: OnValueChangeHandler<T>,
) =>
  React.useCallback(
    (event: ChangeEvent<E>) =>
      onChangeHandler<T, E>(onChange, onValueChange, event),
    [onChange, onValueChange],
  )
