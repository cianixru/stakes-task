import configurable from '@sha/configurable'
import {defaultServiceConfig} from './serviceConfig'
import service from './service'

configurable(service)(defaultServiceConfig)('stakes-crud-servise')
