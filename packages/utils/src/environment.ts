// tslint:disable-next-line:variable-name
let __production: boolean = true

export const setProduction = value =>
    __production = value

export const isProduction = () =>
    __production

const isNodeEnvironment =
    typeof process === 'object' &&
    process + '' === '[object process]'

const isBackend = () =>
    isNodeEnvironment

const isFrontend = () =>
    !isNodeEnvironment

export {
    isFrontend,
    isBackend,
}
