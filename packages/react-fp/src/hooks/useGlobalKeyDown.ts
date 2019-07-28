import { useEffect } from 'react'

const useGlobalKeyDown = (
    callback: (e: KeyboardEvent) => any,
) => {

    useEffect(() => {
            window.addEventListener('keydown', callback)
            return () =>
                window.removeEventListener('keydown', callback)
        },
        [callback],
    )
}

export default useGlobalKeyDown;
