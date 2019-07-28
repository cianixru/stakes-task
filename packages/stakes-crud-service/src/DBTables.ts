import {table} from "./typedKnex"
import * as iso from 'stakes-crud-iso'

@table('tapes')
export class TapeImlp implements iso.TapeRecord {
     barcode: string | null
     production_no: string | null
     tape_no: string | null
     status: string | null
     format: string | null
     tv_standard: string | null
     a1: string | null
     a2: string | null
     a3: string | null
     a4: string | null
     record_date: string | null
     notes: string | null
     in_tx: string | null
     in_vtlib: string | null
     sub_title: string | null
     title: string | null
     itsproduction_no: string | null
     created_date: string | null
     modified_date: string | null
}

@table('events')
export class EventImpl implements iso.EventRecord {
    event_id: number | null
    production_no: string | null
    phase: string | null
    venue: string | null
    event_date: string | null
    image_filename: string | null
    logged_by: string | null
    sport: string | null
    originator: string | null
    title: string | null
    created_date: string | null
    name: string | null
    event_notes: string | null
    modified_date: string | null
}


@table('logs')
export class LogImpl implements iso.LogRecord {
    event_id: number | null
    log_id: string | null
    timecode: string | null
    description: string | null
    tape_no: string | null
}
