import React from 'react'
import { render } from 'react-dom'
import App from './App'
import {configureFrontendStore} from 'stakes-crud-iso'
import { getBrowserHistory, pushPathname} from '@sha/router'

import {globals} from './globals'

const store = configureFrontendStore(getBrowserHistory())

window['redux'] = store
window['forwardLink'] = (link: string) =>{
    getBrowserHistory().push(link)
}//patchLocalLinksToRouter(store)


render(<App  store={store}/>, document.getElementById('root'))
