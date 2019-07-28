import * as path from 'path'
import * as R from 'ramda'
import * as fd from '@sha/file-data'

const isPromise = obj =>
    !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'

/**
 * Call back function, to invoke when config is changed.
 * Configuration could take some time, so configurator must return promise
 */
export type Configurator<C> = (config: C) => Promise<() => Promise<void>>

export default <C>(configurator: Configurator<C>) =>
        (defaultConfig: Partial<C> = {}) =>
          (fileName: string) => {

            const fileData = getConfigRepository<C>(fileName, defaultConfig)

            let isReady = false

            const resolvers: Function[] = []
            let result

            const rebuild = async () => {
                // close previous
                if(result)
                  await result()

                isReady = false
                const actualConfig = fileData.getData()
                const resultConfig = R.mergeDeepRight(defaultConfig, actualConfig)

                // await for new
                result = await configurator(resultConfig as any as C)

                isReady = true
                resolvers.forEach(r => r(result))
                resolvers.length = 0
            }

            rebuild()

            // @ts-ignore
            fileData.signalChange.add(rebuild)

            return () =>
                new Promise(r =>
                    isReady
                        ? r(result)
                        : resolvers.push(r),
                )
        }


export function getConfigRepository<T>(configPath, defaultConfig: Partial<T> = {}): fd.FileDataRepository<T> {
    const filePath = path.join('config', configPath + '.json')

    return fd.fileDataRepository(filePath, defaultConfig, true)
}
