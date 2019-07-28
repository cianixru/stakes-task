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

const tapeColumns: ColumnProps<TapeRecord>[] = [
    {
        key: 'barcode',
        sorter: true,
        title: 'Barcode',
        dataIndex: 'barcode',
    },
    {
        key: 'tape_no',
        sorter: true,
        title: 'Tape No',
        dataIndex: 'tape_no',
    },
    {
        key: 'production_no',
        sorter: true,
        title: 'Production No',
        dataIndex: 'production_no',
    },
    {
        key: 'title',
        sorter: true,
        title: 'Tape Title',
        dataIndex: 'title',
    },
    {
        key: 'sub_title',
        sorter: true,
        title: 'Tape Subtitle',
        dataIndex: 'sub_title',
    },
    {
        key: 'status',
        sorter: true,
        title: 'Status',
        dataIndex: 'status',
    },
    {
        key: 'date',
        sorter: true,
        title: 'Date',
        dataIndex: 'created_date',
    },
    {
        key: 'format',
        sorter: true,
        title: 'Format',
        dataIndex: 'format',
    },
];

const searchTapesApiFunction = api.searchTapes

export default createSearchPane({
    columns: tapeColumns,
    SearchForm: SearchTapesForm,
    asyncApiFunction: searchTapesApiFunction
})