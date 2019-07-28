import * as fsa from '../../../fsa/src'
import {PokerRUBootstrap} from '../valueTypes'


const factory = fsa.actionCreatorFactory('bootstrap')

const actions = {
    fetchBoostrap: factory.async<undefined, PokerRUBootstrap>('fetchBootstrap')
}

const reducer = actions.fetchBoostrap.asyncReducer

export const bootstrapDuck = {
    reducer,
    factory,
    actions,

}