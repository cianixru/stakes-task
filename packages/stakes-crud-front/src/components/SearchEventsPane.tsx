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

type SearchTapeState = Partial<iso.EventRecord & { date_min: string, date_max: string }>

const dateFormat = 'YYYY/MM/DD'

const eventsFields: RecordFields<EventRecord> = {
    production_no: {
        prop: "production_no",
        label: "Production No.",
    },
    title: {
        prop: "title",
        label: "Event Title / Name",
    },
    notes: {
        prop: "notes",
        label: "Event Notes",
    },
    sport: {
        prop: "sport",
        label: "Sport",
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

const SearchTapesForm = (props: SearchFromProps) => {
    const [state, setState] = React.useState<SearchTapeState>({})
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
            createInputField(eventsFields.production_no),
            createInputField(eventsFields.title),
            createInputField(eventsFields.notes),
            createInputField(eventsFields.sport),
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
                    <Ant.Button type="primary" htmlType="submit" onClick={clearFields}>
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

const eventsColumns: ColumnProps<iso.EventRecord>[] = [
    {
        key: 'production_no',
        sorter: true,
        title: 'Production No',
        dataIndex: 'production_no',
    },
    {
        key: 'title',
        sorter: true,
        title: 'Production Title',
        dataIndex: 'title',
    },
    {
        key: 'event_name',
        sorter: true,
        title: 'Name',
        dataIndex: 'event_name',
    },
    {
        key: 'date',
        sorter: true,
        title: 'Date',
        dataIndex: 'event_date',
    },
]

export default createSearchPane({
        columns: eventsColumns,
        SearchForm: SearchTapesForm,
        asyncApiFunction: iso.api({baseURL: globals.httpAPIGateway}).searchEvents
    }
)