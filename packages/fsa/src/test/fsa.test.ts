import {actionCreatorFactory, factoryDelimeter} from '../index'

type TestPayload = {
    testPayload: string,
    testData: string
}

test('create test factory and check its base', () => {
    const testFactory = actionCreatorFactory('test')
    expect(testFactory.base).toBe(`test${factoryDelimeter}`)
})


test('create action from factory and check its type', () => {
    const testFactory = actionCreatorFactory('test')
    const testActionCreator = testFactory('tested')
    expect(testActionCreator().type).toBe('test/tested')
})

test('create action with payload and check payload', () => {
    const testFactory = actionCreatorFactory('test')
    const testActionCreator =   testFactory<TestPayload> ('tested')
    const testActionWithPayload = testActionCreator({testPayload: 'payload', testData: 'data'})
    expect(testActionWithPayload.payload).toEqual({testPayload: 'payload', testData: 'data'})
})
