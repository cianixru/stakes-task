import { useEffect, useState } from 'react'
import { AsyncState, AsyncStatus } from '@sha/fsa'
import { equals } from 'ramda'

type APIResponse<T, E = string[]> = {
  result?: T
  errors?: E
}

export const useAsyncStateByCount = <R, P, E = string[]>(
  api: (params?: P) => Promise<APIResponse<R, E>>,
  params: P,
  timesToFetch: number,
): AsyncState<R, P, E> => {

  const [state, setState] = useState({
    status: 'unset' as AsyncStatus,
    value: undefined,
    timesToFetch,
  } as AsyncState<R, P, E>)

  const [fetched, setFetched] = useState(0)

  const fetchData = async () => {
    if (equals(fetched, timesToFetch)) return

    setState({ value: undefined, error: undefined, status: 'started', params })

    const { result, errors } = await api(params)

    setState({
      value: result,
      error: errors,
      status: errors ? 'failed' : 'done',
      params,
    })
    setFetched(timesToFetch)
  }

  useEffect(() => {
    if (timesToFetch > fetched) fetchData()
    else
      setState({
        status: 'unset' as AsyncStatus,
        value: undefined,
      } as AsyncState<R, P, E>)
  }, [timesToFetch])

  return state as AsyncState<R, P, E>
}

export default <R, P, E = string[]>(
  api: (params?: P) => Promise<APIResponse<R, E>>,
  params?: P,
): AsyncState<R, P, E> => {
  const [state, setState] = useState({
    status: 'unset' as AsyncStatus,
    value: undefined,
  } as AsyncState<R, P, E>)

  const fetchData = async () => {
    if (equals(state.params, params)) return

    setState({ value: undefined, error: undefined, status: 'started', params })

    const { result, errors } = await api(params)

    // @TODO:
    setState({
      value: result,
      error: errors,
      status: errors ? 'failed' : 'done',
      params,
    })
  }

  useEffect(() => {
    if (params !== null) fetchData()
    else
      setState({
        status: 'unset' as AsyncStatus,
        value: undefined,
      } as AsyncState<R, P, E>)
  }, [params])

  return state as AsyncState<R, P, E>
}
