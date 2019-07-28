import fileData, {fileDataRepository} from '../src'
import * as path from 'path'
import cargs from '@sha/cargs'
import * as fs from 'fs'

declare const test: any
declare const expect: any
declare const afterAll: any
declare const beforeAll: any
declare const jest: any

const testData = {
    testData: 'testData',
    moreData: 'anotherData',
}

const deleteDir = (pathToDir: string) => new Promise(resolve => {
    fs.rmdir(pathToDir, result => resolve())
})

const deleteTestData = (pathToDir: string) => new Promise(resolve => {
    fs.unlink(path.join(pathToDir, 'test.json'), result => resolve())
})

test('get basePath', () => {
    const mypath = fileData.getBasePath()
    expect(mypath).toBe(process.env.HOME || (process.env.HOMEDRIVE + process.env.HOMEPATH))
})

test('get appDataPath', () => {
    const appDataPath = fileData.getAppDataPath()
    const basePath = fileData.getBasePath()
    expect(appDataPath).toBe(path.join(basePath, 'btceApps', (cargs.data || 'data')))
})

test('test FileData repository', () => {
    const testRep = fileDataRepository(path.join('test', 'test.json'), testData, true)
    const data = testRep.getData()
    expect(data).toEqual(testData)
    /*const newData = {
        testData: 'testnewData',
    }
    testRep.saveData(newData)
    expect(testRep.getData()).toEqual(newData)*/
})

afterAll(async done => {
    const mypath = path.join(fileData.getBasePath(), 'btceApps', (cargs.data || 'data'), 'test')
    await deleteTestData(mypath)
    await deleteDir(mypath)
    done()
})
