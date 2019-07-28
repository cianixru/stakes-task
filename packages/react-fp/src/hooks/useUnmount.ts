import { useEffect } from 'react'

const useUnmount = (unmount: () => (() => void) | void) => {
    useEffect(
        () => () => {
            if (unmount) unmount()
        },
        [],
    )
}

export default useUnmount
