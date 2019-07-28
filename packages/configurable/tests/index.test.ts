import configurable, {getConfigRepository} from '../src'
import * as fs from 'fs'
import * as path from 'path'
import { getBasePath } from '@sha/file-data'
import { sleep } from '../../utils/src'

declare const test: any
declare const expect: any
declare const afterAll: any

const defaultTestConfig = {
    test: 'test1',
    test1: 'test2',
}

const secondConfig = {
    updatedCfg: 'test',
}

const expectedCfg = {
    test: 'test1',
    test1: 'test2',
    updatedCfg: 'test',
}

let savedCfg = {}

const testConfigurable = cfg => {
    savedCfg = cfg
}

const writeSecondConfig = () => new Promise(resolve => {
    const filePath = path.join(getBasePath(), 'btceApps', 'slave1', 'config', 'test.json')
    const valueToWrite = JSON.stringify({...defaultTestConfig, ...secondConfig})
    fs.writeFile(filePath, valueToWrite, resolve)
})

test('get test config repository', () => {
    const test = getConfigRepository('test', defaultTestConfig)
    expect(test['relativePath']).toBe(path.join('config', 'test.json'))
    expect(test['defaultData']).toEqual(defaultTestConfig)
})

//
test('change config in file and see result ', async () => {
    expect(savedCfg).toEqual({})

    const test = configurable('test')(testConfigurable)(defaultTestConfig)
    await sleep(300)
    expect(savedCfg).toEqual(defaultTestConfig);
    await writeSecondConfig()
    await sleep(300)
    expect(savedCfg).toEqual(expectedCfg)
})

afterAll(done => {
    fs.unlink(path.join(getBasePath(), 'btceApps', 'slave1', 'config', 'test.json'), deleted => done())
})
