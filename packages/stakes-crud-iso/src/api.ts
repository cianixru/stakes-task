import axios, {AxiosPromise} from "axios"
import {SearchRequest, SearchResponse, RecordGetRequest, RecordUpdateRequest, RecordUpdateResponse, EventRecord, LogRecord, RecordGetResponse, TapeRecord} from "./valueTypes"

/**
 * Isomorphic api built on top of isomorphic axios
 * @param baseURL
 */
export const api = ({baseURL} = {baseURL: '/api/v0.1'}, mockMode: boolean = false) => {

    const create = () => {
        const instance = axios.create({
            baseURL,
            headers: {},
        })

        return instance
    }


      const handleResponse =
        async <T>(promise: AxiosPromise<{data: T}>, mapper: {(value: T): T} = (value: T) => value) => {
            try {
                let result = (await promise).data
                // @ts-ignore
                result = mapper(result)

                return {result}
            } catch (e) {
                return {errors: e, result: undefined}
            }
        }

    const stakesHTTP = create()
    return {

        searchEvents: (arg: SearchRequest<EventRecord>): Promise<SearchResponse<EventRecord>> =>
            // @ts-ignore
            handleResponse<any>(
                stakesHTTP.post('/searchEvents', arg)
            ),

        searchLogs: (arg: SearchRequest<LogRecord>): Promise<SearchResponse<LogRecord>> =>
            // @ts-ignore
            handleResponse<any>(
                stakesHTTP.post('/searchLogs', arg)
            ),

        searchTapes: (arg: SearchRequest<TapeRecord>): Promise<SearchResponse<TapeRecord>> =>
            // @ts-ignore
            handleResponse<any>(
                stakesHTTP.post('/searchTapes', arg)
            ),


        getEvent: (arg: RecordGetRequest<EventRecord, 'event_id'>): Promise<RecordGetResponse<EventRecord>> =>
            // @ts-ignore
            handleResponse<any>(
                stakesHTTP.post('/getEvent', arg)
            ),

        getLog: (arg: RecordGetRequest<LogRecord, 'log_id'>): Promise<RecordGetResponse<LogRecord>> =>
            // @ts-ignore
            handleResponse<any>(
                stakesHTTP.post('/getLog', arg)
            ),
        getTape: (arg: RecordGetRequest<TapeRecord, 'tape_no'>): Promise<RecordGetResponse<TapeRecord>> =>
            // @ts-ignore
            handleResponse<any>(
                stakesHTTP.post('/getTape', arg)
            ),
    }
}


/**
 * This type xported to be implemented by server side api, which maptch methods to routes,
 * Also this api could be used by mock api
 */
export type RestAPI = ReturnType<typeof api>
