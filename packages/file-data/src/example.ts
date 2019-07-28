import {fileDataRepository} from './index'
import fileUtils from './index'
import * as path from 'path'

const repo = fileDataRepository(path.join('a', 'b', 'd', 'e', 'data.json'), {obj: {a: 17}})

console.log(fileUtils.getAppDataPath())
console.log(fileUtils.getBasePath())
console.log(fileUtils.getDistPath())
console.log(repo.getData())
