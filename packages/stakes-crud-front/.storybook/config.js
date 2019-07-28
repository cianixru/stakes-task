import { setConfig } from 'react-hot-loader'
import { configure } from '@storybook/react'

/**
 * Use this option for functional components
 * with new React hooks API
 */
setConfig({ pureSFC: true })

const req = require.context("../src", true, /.story.tsx?$/)

configure(() => {
    // require('../src/auctionApi.story')
    req.keys()
        .sort()
        .forEach(req);
}, module);
