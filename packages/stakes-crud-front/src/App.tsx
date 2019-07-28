import React from 'react'
import { connect, Provider } from 'react-redux'
import { configureFrontendStore, FrontState} from 'stakes-crud-iso'
import { getBrowserHistory, Redirect, Route, Switch, ConnectedRouter  } from '@sha/router'
import {Provider as ReactiveProvider} from 'reactive-react-redux'
import { HistoryContext, useSubscribe } from './contexts'
import DesktopRoot from './components/DesktopRoot'



/**
 * Legacy provider used for connected-react-router
 * @constructor
 */

const App = ({store}) => {
  return       <Provider store={store}>
                  <HistoryContext.Provider value={getBrowserHistory()}>
                      <ConnectedRouter history={useSubscribe(HistoryContext)}>
                          <DesktopRoot />
                      </ConnectedRouter>
                  </HistoryContext.Provider>
                </Provider>
  /*
  return (
    <ReactiveProvider store={store}>
        <Provider store={store}>
          <HistoryContext.Provider value={getBrowserHistory()}>
            <DesktopRoot />
          </HistoryContext.Provider>
        </Provider>
    </ReactiveProvider>
  )*/
}
export default App
