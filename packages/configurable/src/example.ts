import configurable from './index'

const configurate = async cfg => {
    // tslint:disable-next-line:no-console
    console.log('Сonfigure:', cfg)
}

const setUp = configurable('cfg')(configurate)({leather: 8})
