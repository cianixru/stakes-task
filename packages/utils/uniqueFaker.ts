import * as faker from 'faker'

const uniqFakers = {}

export const getUniqFaker = (
    instanceName: string,
    apiMethod: string = 'name',
    apiInstance: string = 'firstName',
) => {
    if (uniqFakers[instanceName])
        return uniqFakers[instanceName]

    const NewFaker = () => {
        const resultCache = [] as any[]
        return () => {
            let result =  faker[apiMethod][apiInstance]() as any
            result = resultCache.indexOf(result) === -1 ? result : result + 1
            resultCache.push(result)
            return result
        }
    }

    uniqFakers[instanceName] = NewFaker()

    return NewFaker()
}

export default getUniqFaker
