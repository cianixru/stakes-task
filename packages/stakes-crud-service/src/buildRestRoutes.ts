import fastify from 'fastify'
import {api, RestAPI} from 'stakes-crud-iso'
import {KnexConnection} from './createKnexConnection'
import * as DBTables from './DBTables'


type Fastify = ReturnType<typeof fastify>
type ThenArg<T> = T extends Promise<infer U> ? U : T

const log = console.log

const cachedRoutes = {}
const mapApiToRoutes = <T>(fastify: Fastify, api: T) =>
    Object
        .keys(api)
        .forEach(
            (route: string) => {
                log('register route', '/' + route)
                fastify.post('/' + route, async (request, reply: any) => {
                    console.time('requets ' + route +  JSON.stringify(request.body))

                    const path = route + ':' + JSON.stringify(request.body)


                    let result = await api[route](request.body)

                    //const compressed = await new Promise( resolve => zlib.brotliCompress(raw, (error, result) => resolve(result)))
                    console.timeEnd('requets ' + route +  JSON.stringify(request.body))
                    reply
                        .code(200)
                        .type('application/json')
                        .compress(result)
                })
            },
    )


export default (db: KnexConnection) => (fastify: Fastify , opts, next) => {


    const apiImpl: RestAPI = {
        searchEvents: async ({limit = 10, offset = 0, search = {}, sortField, sortOrder}) => {


            const {title, ...props} = search

            let whereClause = ''
            // look title as title and sub_title columns

            if (title)
                whereClause = " title ILIKE '%" + title + "%' OR sub_title ILIKE '%" + title + "%'"


            const total = await db.nativeKnex('events').whereRaw(whereClause).count('*')

            let resultQuery = db.query(DBTables.EventImpl).whereRaw(whereClause)
            if (sortField) {
                if (sortOrder === 'descend')
                    resultQuery.orderByRaw(sortField + ' desc')
                else
                    resultQuery.orderByRaw(sortField + ' asc')
            }
            const data = await resultQuery.offset(offset).limit(limit).list()

            return {
                data,
                limit,
                offset,
                total: Number(total[0].count),
            }
        },

        searchLogs: async ({limit = 10, offset = 0, search = {}, sortField, sortOrder}) => {


            const { ...props} = search

            let whereClause = ''
            // look title as title and sub_title columns

            //if (title)
            //    whereClause = " title ILIKE '%" + title + "%' OR sub_title ILIKE '%" + title + "%'"


            const total = await db.nativeKnex('logs').whereRaw(whereClause).count('*')

            let resultQuery = db.query(DBTables.LogImpl).whereRaw(whereClause)
            if (sortField) {
                if (sortOrder === 'descend')
                    resultQuery.orderByRaw(sortField + ' desc')
                else
                    resultQuery.orderByRaw(sortField + ' asc')
            }
            const data = await resultQuery.offset(offset).limit(limit).list()

            return {
                data,
                limit,
                offset,
                total: Number(total[0].count),
            }
        },

        searchTapes: async ({limit = 10, offset = 0, search = {}, sortField, sortOrder}) => {



            const {title, ...props} = search

            let whereClause = ''
            // look title as title and sub_title columns

            if (title)
                whereClause = " title ILIKE '%" + title + "%' OR sub_title ILIKE '%" + title + "%'"


            const total = await db.nativeKnex('tapes').whereRaw(whereClause).count('*')

            let resultQuery = db.query(DBTables.TapeImlp).whereRaw(whereClause)
            if (sortField) {
                if (sortOrder === 'descend')
                    resultQuery.orderByRaw(sortField + ' desc')
                else
                    resultQuery.orderByRaw(sortField + ' asc')
            }
            const data = await resultQuery.offset(offset).limit(limit).list()

            return {
                data,
                limit,
                offset,
                total: Number(total[0].count),
            }
        },
        getEvent: async ({id}) => {
            return {
                data: (await db.query(DBTables.EventImpl).where('event_id', Number(id)))[0]
            }
        },
        getLog: async ({id}) => {
            return {
                data: (await db.query(DBTables.LogImpl).where('log_id', String(id)))[0]
            }
        },
        getTape: async ({id, item}) => {

            let tape = (await db.query(DBTables.TapeImlp).where('tape_no', String(id)).limit(1).list())[0]
            if (!tape)
                tape = (await db.query(DBTables.TapeImlp).limit(1).list())[0]
            return {
                data: tape
            }
        }
    }

    mapApiToRoutes(fastify, apiImpl)

    next()
}