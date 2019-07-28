import queryString from 'query-string'

export type PokerRUClientConfig = {
    httpAPIGateway: string

}

const defaultConfig: PokerRUClientConfig = {
    httpAPIGateway: process.env.HTTP_GATEWAY || 'https://localhost:3000/api/v0.1',
}


const parsed: Partial<PokerRUClientConfig> = queryString.parse(location.search)

export const globals = {...defaultConfig, ...parsed}
