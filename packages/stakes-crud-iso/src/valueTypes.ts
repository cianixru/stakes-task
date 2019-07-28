import {AssociativeArray} from "../../utils/src"
import * as osm from './osm'

export type TapeRecord = osm.tapes

export type EventRecord = osm.events

export type LogRecord = osm.logs

export type SearchRequest<T> = {
    search?: Partial<T>
    offset?: number
    limit?: number
    sortField?: keyof T
    sortOrder?: any
}

export type SearchResponse<T> = {
    data: T[]
    search?: Partial<T>
    offset?: number
    limit?: number
    total: number
    sortField?: keyof T
    sortOrder?: any
}

export type SearchLogsConditions = {
    production_no: string
    event_sport: string
    event_title: string
    event_name: string
    event_date: string


}

export type RecordGetRequest<T, IDKey extends keyof T> = {
    id: string,
    item?: T
}

export type RecordGetResponse<T> = {
    data: T
}
export type RecordUpdateRequest<T> = {
    data: Partial<T>
}

export type RecordUpdateResponse<T> = {
    data: T
}

    