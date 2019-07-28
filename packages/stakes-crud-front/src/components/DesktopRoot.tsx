import React, {useState} from 'react'
import {connect} from 'react-redux'
import {FrontState} from 'stakes-crud-iso'
import 'antd/dist/antd.css'
import SearchTapesPane from './SearchTapesPane'
import SearchEventsPane from './SearchEventsPane'
import SearchLogsPane from './SearchLogsPane'
import { Redirect, Route, Switch, ConnectedRouter, NavRoute } from '@sha/router'
import {nav} from '../nav'
import {useSubscribe, HistoryContext} from '../contexts'
import TapesPane from './TapesPane';

const routes = [
    {
        nav: nav.searchEvents,
        label: 'Search events',
        Component: SearchEventsPane,
    },
    {
        nav: nav.searchLogs,
        label: 'Search logs',
        Component: SearchEventsPane,
    },
    {
        nav: nav.searchTapes,
        label: 'Search Tapes',
        Component: SearchTapesPane,
    },
    {
        nav: nav.tapes,
        label: 'Tapes',
        Component: TapesPane,
    }
]
const patternResolver = nav => {
    return nav.pattern
}


const reactRoutes = routes
    .map(({ Component, nav, exact = true }) => (
        <Route
            exact={exact}
            key={nav.pattern}
            path={patternResolver(nav)}
            render={props => (
                // @ts-ignore
                <Component {...props.match.params as any} />
            )}
        />
    ))
    .concat(
        []
    )

const getSelectedTabIndex = (pathname: string) => {
    return routes.findIndex(r => r.nav.match(pathname) !== null)
}

const isNotFoundRoute = (pathname: string) => {
    return pathname === '/404'
}


const pathnameSelector = state => state.router.location.pathname
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const DesktopRootRaw = (state: FrontState) => {
    const onTabChange = console.log
/*
    const isBusy = state.app.ui.busy.length > 0
    if (routes[routes.length - 1] !== state.router ) {
        routes.push(state.router)
    }

    const router = (isBusy ? routes[routes.length - 2] : routes[routes.length - 1]) || state.router

*/

    //document.body.style.opacity = isBusy ? 0.3 : 1
    return     <Tabs defaultActiveKey="1" onChange={onTabChange}>
                    <TabPane tab="Search Event" key="1">
                        <SearchEventsPane/>
                    </TabPane>
                    <TabPane tab="Search Tapes" key="2">
                        <SearchTapesPane />
                    </TabPane>
                    <TabPane tab="Search logs" key="3">
                        <SearchLogsPane />
                    </TabPane>
                    <TabPane tab="Tapes" key="4">
                        <TapesPane />
                    </TabPane>
                    <TabPane tab="Events" key="5">
                        <TapesPane />
                    </TabPane>
                </Tabs>

}
export default connect(
    (state) => state,
    dispatch => ({ dispatch }),
)(DesktopRootRaw)
