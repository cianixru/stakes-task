import React from 'react'
import * as Ant from 'antd'
import * as iso from 'stakes-crud-iso'
import { TapeRecord } from 'stakes-crud-iso'
import moment from 'moment'
import { useAsyncState } from '../../../react-fp/src'
import { oc } from 'ts-optchain'
import styled from 'styled-components'
import {ColumnProps} from 'antd/lib/table'
import {globals} from '../globals'
import {RecordFields, default as createSearchPane} from './createSearchPane'


const api = iso.api({baseURL: globals.httpAPIGateway})

type SearchTapeState = Partial<iso.TapeRecord & { date_min: string, date_max: string }>

const dateFormat = 'YYYY/MM/DD'

export const tapeFields: RecordFields<TapeRecord> = {
    production_no: {
        prop: "production_no",
        label: "Production No.",
    },
    barcode: {
        prop: "barcode",
        label: "Barcode",
    },
    title: {
        prop: "title",
        label: "Title",
    },
    sub_title: {
        prop: "sub_title",
        label: "Subtitle",
    },
    status: {
        prop: "status",
        label: "Status",
    },
    itsproduction_no: {
        prop: "itsproduction_no",
        label: "ITS Production NO",
    },
    format: {
        prop: "format",
        label: "Format",
    },
    notes: {
        prop: "notes",
        label: "Tape notes",
    },
    tape_no: {
        prop: "tape_no",
        label: "Tape no",
    },
}


type SearchFromProps = {
    onSubmit: (value) => any
    item: TapeRecord
}

const FormLayout = styled.div`
      display: grid;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      grid-gap: 2vw;
    `

const TapeForm = (props: SearchFromProps) => {
    const [state, setState] = React.useState<SearchTapeState>(props.item)
    if(state.tape_no !== props.item.tape_no)
        setState(props.item)
    const createInputField = ({label, prop}: { label: string, prop: keyof TapeRecord }) =>
        <Ant.Form.Item>
            <Ant.Input
                value={state[prop]}
                onChange={e => {
                    setState({...state, [prop]: e.target.value})
                }}
                placeholder={label}
            />
        </Ant.Form.Item>

    const getFields = () => {
        return [
            createInputField(tapeFields.production_no),
            createInputField(tapeFields.barcode),
            createInputField(tapeFields.title),
            createInputField(tapeFields.status),
            createInputField(tapeFields.itsproduction_no),
            createInputField(tapeFields.format),
            createInputField(tapeFields.notes),
            createInputField(tapeFields.tape_no),
        ]
    }

    return (
        <div>
            <FormLayout>
                {getFields()}
                <Ant.Form.Item>
                    <Ant.Button type="primary" htmlType="submit" onClick={() => props.onSubmit(state)}>
                        Search
                    </Ant.Button>
                </Ant.Form.Item>
                <Ant.Form.Item>
                    <Ant.Button type="primary" htmlType="submit" onClick={() => setState({})}>
                        Clear fields
                    </Ant.Button>
                </Ant.Form.Item>
                <Ant.Form.Item>
                    <Ant.DatePicker value={moment(state.date_min)} placeholder="Date from"/>
                </Ant.Form.Item>
                <Ant.Form.Item>
                    <Ant.DatePicker value={moment(state.date_max)} placeholder="Date to"/>
                </Ant.Form.Item>
                <Ant.Form.Item>
                    <Ant.Checkbox>In TX</Ant.Checkbox>
                </Ant.Form.Item>
            </FormLayout>
        </div>
    )
}

const TapesPane = ({tape_no}) => {
    console.log('TapesPane, current Tape id', tape_no)
    const originalTape = useAsyncState(api.getTape, {id: tape_no})

    const onSave = (tape) => {
        api.getTape({id: tape_no, item: tape})
    }
    return <TapeForm onSubmit={onSave} item={originalTape}/>
}

export default TapesPane
