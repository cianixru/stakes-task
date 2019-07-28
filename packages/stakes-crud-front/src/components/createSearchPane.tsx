import {ColumnProps} from 'antd/lib/table'
import React from 'react'
import * as Ant from 'antd'
import * as iso from 'stakes-crud-iso'
import { TapeRecord } from 'stakes-crud-iso'
import moment from 'moment'
import { useAsyncState } from '../../../react-fp/src'
import { oc } from 'ts-optchain'
import styled from 'styled-components'

export type SearchPaneOptions<R> = {
    columns: ColumnProps<R>[]
    asyncApiFunction: Function
    SearchForm: React.ComponentType<{onSubmin: Function}>
}

export type Field<P> = {
    label: string
    prop: P
}

export type RecordFields<R> = {
    [key in keyof Partial<R>]: Field<keyof Partial<R>>
}

const createSearchPane = (options: SearchPaneOptions<any>) => {

    const {SearchForm, columns, asyncApiFunction} = options

    class TapesTable extends Ant.Table<TapeRecord> {
    }

    const defaultPageSize = 10

    const SearchTapesPane = () => {

        const [params, setParams] = React.useState<iso.SearchRequest<iso.TapeRecord>>({limit: defaultPageSize})

        // @ts-ignore
        const asyncState = useAsyncState(asyncApiFunction, params)

        const onSearch = (value) => {
            setParams({
                ...params,
                limit: 10,
                offset: 0,
                search: value
            })
        }

        const onPagination = (pageNumber, pageSize = defaultPageSize) => {
            setParams({
                ...params,
                offset: pageNumber * pageSize,
                search: params.search,
            })
        }

        const handleTableChange = (pagination, filters, sorter) => {
            setParams({
                ...params,
                sortField: sorter.field,
                sortOrder: sorter.order,
                offset: pagination.current * defaultPageSize,
            })
        }

        const pagination = {
            current: oc(asyncState).value.offset(0) / defaultPageSize,
            total: Math.floor(oc(asyncState).value.total(0)) - 1,
        }

        // const prevData = usePreviousValue(asyncState.value)

        const data = asyncState.value ? asyncState.value.data : []
        console.log('data for table', data)
        return  <div>
            <SearchForm onSubmit={onSearch}/>
        <TapesTable
        columns={columns}
        dataSource={data}
        loading={asyncState.status === 'started'}
        pagination={pagination}
        onChange={handleTableChange}
        />
        </div>
    }

    return SearchTapesPane
}

export default createSearchPane