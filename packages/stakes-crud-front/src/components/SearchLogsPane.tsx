import React from 'react'
import * as Ant from 'antd'
import * as iso from 'stakes-crud-iso'
import { TapeRecord, EventRecord } from 'stakes-crud-iso'
import moment from 'moment'
import { useAsyncState } from '../../../react-fp/src'
import { oc } from 'ts-optchain'
import styled from 'styled-components'
import {ColumnProps} from 'antd/lib/table'
import {globals} from '../globals'
import {RecordFields, default as createSearchPane} from './createSearchPane'

const api = iso.api({baseURL: globals.httpAPIGateway})

type SearchTapeState = Partial<any >

const dateFormat = 'YYYY/MM/DD'

const logFields = {
    production_no: {
        prop: "production_no",
        label: "Event Production No",
    },
    log_descriptor: {
        prop: "log_descriptor",
        label: "Log descriptor",
    },

    title: {
        prop: "title",
        label: "Event Title",
    },
    sport: {
        prop: "sport",
        label: "Event Sport",
    },

    name: {
        prop: "name",
        label: "Event Name",
    },

    any: {
        prop: "any",
        label: "Event title log descriptor",
    },

    tape_no: {
        prop: "tape_no",
        label: "Log Tape No",
    },


}


type SearchFromProps = {
    onSubmit: (value) => any
}

const FormLayout = styled.div`
      display: grid;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      grid-gap: 2vw;
    `

const SearchLogsForm = (props: SearchFromProps) => {
    const [state, setState] = React.useState<SearchTapeState>({})
    const createInputField = ({label, prop}: { label: string, prop: keyof any }) =>
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
            createInputField(logFields.production_no),
            createInputField(logFields.log_descriptor),
            createInputField(logFields.title),
            createInputField(logFields.sport),
            createInputField(logFields.name),
            createInputField(logFields.any),
            createInputField(logFields.tape_no),
        ]
    }

    const clearFields = () => {
        setState({})
        props.onSubmit({})
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
                    <Ant.Button
                        type="primary"
                        htmlType="submit"
                        onClick={clearFields}
                    >
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

const logColumns: ColumnProps<iso.LogRecord & {tape_no: string, }>[] = [
    {
        key: 'production_no',
        sorter: true,
        title: 'Production No',
        dataIndex: 'production_no',
    },
    {
        key: 'tape_no',
        sorter: true,
        title: 'Production Title',
        dataIndex: 'tape_no',
    },
    {
        key: 'timecode',
        sorter: true,
        title: 'Timecode',
        dataIndex: 'timecode',
    },
    {
        key: 'description',
        sorter: true,
        title: 'Dscription',
        dataIndex: 'description',
    },
]

export default createSearchPane({
        columns: logColumns,
        SearchForm: SearchLogsForm,
        asyncApiFunction: iso.api({baseURL: globals.httpAPIGateway}).searchLogs
    }
)