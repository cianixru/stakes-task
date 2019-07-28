import cliArgv from '@sha/cargs'
import * as fs from 'fs'
import {Signal} from '@sha/signal'
import * as path from 'path'
import * as R from 'ramda'
import requireMainFileName from 'require-main-filename'

let basePath: string = (process.env.HOME || (process.env.HOMEDRIVE + process.env.HOMEPATH))
console.log('check cliArgs',  cliArgv)

let cliArgDataPath = global['data'] || cliArgv.data || 'data'
let appDataPath = path.join('btceApps', cliArgDataPath)
global['data'] = cliArgDataPath

export const setDataPath = value => {

    global['data'] = cliArgDataPath = value
    console.log(global['data'])
    appDataPath = path.join('btceApps', cliArgDataPath)
}

const setBasePath = (basePath1, appDataPath1) => {
    basePath = basePath1
    appDataPath = appDataPath1
}

export const getBasePath = () => basePath

const getAppDataPath = () => path.join(basePath, 'btceApps', global['data'])

let mainFilePath = requireMainFileName()                // requireMainFileName вызывает process.cwd() при
                                                        // require.main === undefined, что дает абсолютный путь
if (mainFilePath.indexOf('src') === -1)                // на папку пакета без dist
    mainFilePath = path.join(process.cwd(), 'src')

let parentName = mainFilePath.split(path.sep).pop()

while (parentName !== 'src') {
    mainFilePath = mainFilePath.slice(0, -parentName.length - 1)
    parentName = mainFilePath.split(path.sep).pop()
}

const distPath = mainFilePath + path.sep

const getDistPath = () =>
    distPath

export const ensureDirectory = directory => {
    /// console.log('ensure directory', directory)
    return !fs.existsSync(directory) && fs.mkdirSync(directory)
}


export const ensureDataDirectories = directory => {

    let testPath = basePath
    const appParts = path.join('btceApps', global['data']).split(path.sep)

    for (let i = 0; i < appParts.length; i++) {
        testPath = path.join(testPath, appParts[i])
        ensureDirectory(testPath)
    }
    const pathArray = directory.split(path.sep)

    if (pathArray[pathArray.length - 1].indexOf('.') !== -1)
        pathArray.pop()

    let additionPath = ''

    for (let i = 0; i < pathArray.length; i++) {
        if (i === 0 && pathArray[i].includes(':'))
            additionPath = pathArray[0]
        else
            additionPath = path.join(additionPath, pathArray[i])

        if (!testPath.startsWith(additionPath)) {
            testPath = path.join(testPath, pathArray[i])
            ensureDirectory(testPath)
        }
    }
}

export {
    setBasePath,
    getAppDataPath,
    getDistPath,
}

const nullLog = (...params) => 0

const logger = {
    log: nullLog,
    info: nullLog,
}

export const trimSlashes = dataDir => {
    if (dataDir.charAt(0) === '/' || dataDir.charAt(0) === '\\')
        dataDir.splice(1, dataDir.length)

    if (dataDir.charAt(dataDir.length) === '/' || dataDir.charAt(dataDir.length) === '\\')
        dataDir = dataDir.splice(0, dataDir.length - 1)

    return dataDir
}


type FileDataChangeListener<T> = (fileData: Partial<T>) => any

type FileDataCorruptedListener = () => void

export class FileDataRepository<T> {

    readonly fullFilePath: string
    /**
     * Was the Data corrupter
     */
    public isCorrupted = () =>
        this._isCorrupted
    /**
     * Manualy save Data info file, and signalize in case of success with help of watchers
     * @param newFileData
     */
    public saveData = (newData: Partial<T>) => {
        this.inWrite = true
        ensureDataDirectories(this.relativePath)

        fs.writeFileSync(this.fullFilePath, JSON.stringify(newData, null, 4), {flag: 'w'})
        this.inWrite = false
    }
    public getData = (): Partial<T> =>
        this.data
    public setUpData = (): Partial<T> =>
        this.data
    /**
     * Signalize when Data was changed and structure of json file is ok
     * @type {Signal<DataChangeListener>}
     */
    public readonly signalChange = new Signal<FileDataChangeListener<T>>()
    /**
     * Signalize when Data was changed and structure of json file is ok
     * @type {Signal<DataChangeListener>}
     */
    public readonly signalCorrupted = new Signal<FileDataCorruptedListener>()
    private fileName: string
    private fileFolder: string
    private pathArray: string[]
    private inWrite = false
    private data: Partial<T> = {}
    private _isCorrupted: boolean
    private readData = () => {
        try {
            ensureDataDirectories(this.relativePath)
            const newData = this.readDataSync()

            this._isCorrupted = false
            if (JSON.stringify(newData) !== JSON.stringify(this.data)) {
                //@ts-ignore
                this.data = R.mergeDeepLeft(newData, this.defaultData)
                this.signalChange.dispatch(this.data)
            }

        } catch (e) {
            this._isCorrupted = true
            this.signalCorrupted.dispatch()
        }
    }
    private readDataSync = () => {
        ensureDataDirectories(this.relativePath)

        logger.info('check if file', this.fullFilePath, 'exists')

        if (!fs.existsSync(this.fullFilePath)) {
            logger.info('file is not exists, create new one', this.fullFilePath)
            this.saveData(this.defaultData)
        } else
            logger.info('file exists', this.fullFilePath)

        logger.info('read file file', this.fullFilePath)

        const dataString = fs.readFileSync(this.fullFilePath, 'utf8').toString()

        const dataRaw = (dataString === '' || R.isEmpty(dataString))
            ? {}
            : JSON.parse(dataString)

        if (this.writeDefaultInCaseOfEmpty && R.isEmpty(dataString) && dataString === '')
            this.saveData(this.defaultData)

        return R.mergeDeepLeft(dataRaw, this.defaultData)
    }
    private setWatchers = () => {
        const self = this
        ensureDataDirectories(this.relativePath)
        fs.watch(this.fileFolder, (eventType, filename) => {
            if ((eventType === 'rename' && filename === this.fileName) ||
                (eventType === 'change' && filename === this.fileName)
            )
                if (!self.inWrite) this.readData()
        })
        /*fs.watch(dataDirectory + '/../', (eventType, filename) => {
            if(eventType =='rename' && filename == dataArgName)
                this.readData()
        })
        fs.watch(dataDirectory + '/../../', (eventType, filename) => {
            if(eventType =='rename' && filename == 'data')
                this.readData()
        })*/
    }

    constructor(
        private relativePath: string,
        private defaultData: Partial<T> = {},
        private writeDefaultInCaseOfEmpty: boolean = false,
    ) {
        this.pathArray = relativePath.split(path.sep)
        this.fullFilePath = path.join(getAppDataPath(), relativePath)
        this.fileFolder = path.join(this.fullFilePath, '..')
        this.fileName = path.parse(this.fullFilePath).base
        this.readData()
        this.setWatchers()
    }
}

const repositories: Array<FileDataRepository<any>> = []

export function fileDataRepository<T>(
    filePath: string,
    defaultData: Partial<T> = {},
    writeDefaultInCaseOfEmpty: boolean = false
): FileDataRepository<T> {

    const fullPath = path.join(getAppDataPath(), filePath)
    console.log('check config fullPath', fullPath)
    if (!repositories[fullPath])
        repositories[fullPath] = new FileDataRepository<T>(filePath, defaultData, writeDefaultInCaseOfEmpty)

    return repositories[fullPath]
}

