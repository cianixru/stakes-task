import React from 'react'
import { Renderable, renderChildren,  useMount, useUnmount } from '../../../react-fp/src'
import { NowContext } from '.'
import { now } from '../../../utils/src'

type NowProvideProps = {
    children?: Renderable
}

export default ({children}: NowProvideProps) => {
    const [value, setValue] = React.useState(now())
    const nowRef = React.useRef(null)

    // 5 minutes ahead
    const setNow = React.useCallback(() => setValue(now(5 * 60 * 1000)), [])

    useMount(() => {
        // update each 2 minutes
        nowRef.current = setInterval(setNow, 1000 * 120)
    })
    useUnmount(() => clearInterval(nowRef.current))

    return React.createElement(NowContext.Provider, {
        children: renderChildren(children),
        value,
    })
}
