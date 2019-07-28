export const defaultServiceConfig = {
  http: {
    port: 3001,
    host: '0.0.0.0',
    apiVersion: 'v0.2',
    externalHost: 'https://develop.btce.com',
  },
  https: {
    port: 3000,
    host: '0.0.0.0',
    apiVersion: 'v0.2',
    options: {
      key: 'C:\\openssl.key',
      cert: 'C:\\openssl.crt',
    },
  },
  mysql: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'stakes-debug',
  },
  postgres: {
    connection: 'postgres://postgres:root@localhost:5432/stakes-debug',
  }
}

export type ServiceConfig = typeof defaultServiceConfig
