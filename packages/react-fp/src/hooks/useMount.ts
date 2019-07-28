import { useEffect } from 'react'

const useMount = (mount: () => (() => void) | void) => useEffect(mount, [])

export default useMount
