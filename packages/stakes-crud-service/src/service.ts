import {ServiceConfig} from './serviceConfig'
import http2, {ServerHttp2Stream, Http2ServerRequest} from 'http2'
import fs from 'fs'
import fastify from 'fastify'
import path from 'path'

import {staticServe} from 'fastify-auto-push'
import buildRestRoutes from './buildRestRoutes'
import createKnexConnection from './createKnexConnection'


const log = console.log


export default async (config: ServiceConfig) => {





    const Fastify = require('fastify')
    const fastify = Fastify({})

    const knex = createKnexConnection(config.postgres)
    fastify.register(require('fastify-cors'), {origin: false,})
    fastify.register(require('fastify-compress'), { global: false })
    fastify.register(buildRestRoutes(knex), {prefix: '/api/v0.1'})
    /*fastify.register(require('fastify-static'), {
        root: staticAssetsFolder,
    })*/


    fastify.listen(config.http.port)


    log('server started', config.http.host, config.http.port)

    return async () => {
        await new Promise(resolve =>
            log('close'),
        )
    }
}
