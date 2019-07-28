import knex from 'knex'
import { TypedKnex } from './typedKnex'

const defaultKnexConfig = {
    connection: 'postgres://postgres:root@localhost:5432/stakes-debug'
}

const createKnexConnection = (config: typeof defaultKnexConfig = defaultKnexConfig) =>
  new TypedKnex(
    knex({
      client: 'pg',
      connection: config.connection,
    }),
  )



export type KnexConnection = TypedKnex

export default createKnexConnection
