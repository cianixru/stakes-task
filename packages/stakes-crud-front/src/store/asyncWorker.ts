import { AsyncActionCreators, FactoryAnyAction } from '../../../fsa/src'
import { call, put, race, select, take, takeEvery } from 'redux-saga/effects'
import {uiDuck} from '../../../poker-ru-iso/src/store/uiDuck'

export type APIResponse<T, E = string[]> = {
    result?: T
    errors?: E
}

const log = console.info

export function* asyncWorker<P, S, E = any>(
    actionCreators: AsyncActionCreators<P, S, E>,
    method: (p?: P) => Promise<S | E>,
    requirebusy = true,
) {
    function* callApi(action: FactoryAnyAction) {
        try {
            const response: APIResponse<any> = yield call(method, action.payload)
            yield put(uiDuck.actions.busy('router'))
            console.log('response', response)
            if (response.errors)
                yield put(
                    actionCreators.failed({
                        params: action.payload,
                        error: JSON.stringify(response.errors),
                    })
                )
            else
                yield put(
                    actionCreators.done({
                        params: action.payload,
                        result: response.result,
                    })
                )
        } catch (e) {
            console.log(e);
            actionCreators.failed({
                params: action.payload,
                error: JSON.stringify(e),
            })
        }
        yield put(uiDuck.actions.unbusy('router'))

    }

    if (!actionCreators.started) debugger

    const pattern = action => {
        const result = actionCreators.started.isType(action)
        return result
    }

    yield takeEvery(pattern, callApi)
}
