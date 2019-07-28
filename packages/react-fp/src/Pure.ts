
import * as React from 'react'
import {map} from 'ramda'
import {concatR, IConsumer} from './fp/fp'
import * as ReactDOM from 'react-dom'
import {ReactInstance} from 'react'
import {withProps, defaultProps} from 'recompose'
import {mergeDeepRight} from 'ramda'
import {connect} from 'react-redux'

export type Func<I, O> = (input: I) => O

export type Action<P> = {
    type: string,
    payload: P
}
// type PReducer<S, P> = (state:S, p:P) => S

export const messageFactory = <P>(type: string) =>
    (payload?: P): Func<P, Action<P>> | any =>
        ({type, payload}) as any

export type ChildProps<P, M, E, S> = P &  S & M & WithRefs & {setState?: (partState: Partial<S>) => any}

export type ChildComp<P, M, E, S> = React.ComponentType<ChildProps<P, M, E, S>>


export type PureProps<P, M, E, S> =  {
    init?: Partial<S>
    children?: React.SFC<ChildProps<P, M, E, S>>
} & Partial<E> &  Partial<M> & P

export type Resolver<S, E> = (effects: E, state: S, nextState: S) => Action<any> | undefined

export type PureValue<P, M, E, S> = {
    messages: M
    effects: E
    update: IConsumer<S, Action<any>, S>
    resolvers: Array<Resolver<S, E>>
    stateMappers: Array<StateMapper<any, any>>
}

export type NextPropsReciever<P, M, E, S> = (state: S, props: P, nextProps: P) => S


type WithRefs = {
    pureRefs?: {[key: string]: any}
    makeRef?: (name: string) => (element: ReactInstance) => any
}

export const getStateActions = <T>() =>
    ({
        setState: messageFactory<T>('setState'),
    })


export type Empty = {dispatch?: (action: Action<any>) => any}
/**
 * Pure container Component
 * Acceps a childern element as a React.SFC - to render
 * one after state updates and expose some additional props
 * P - props
 * M - Inside actions will be exposed as effects too
 * E - effects, only external actions
 * S - inner state to forward one into child renderer,
 * you can infer all properties in (props) => element children component
 */

export const Pure = <P = Empty, M = Empty, E = Empty , S = Empty> (
    messages?: M,
    effects?: E,
    update: IConsumer<S, Action<any>, S> = _ => _,
    resolvers: Array<Resolver<S, E>> = [],
    ctx: any = {},
    components: Array<any> = [],
    hoc = undefined,
    stateMappers: Function[] = [],
) => {
    messages = messages || {} as any as M
    effects = effects || {} as any as E
    type State = Partial<S>
    let Comp = class PureContainer extends React.Component<PureProps<P, M, E, State>, State> {

        constructor(props) {
            super(props)
            const {init, children, ...exposeToState} = props
            this.currentState = this.state = exposeToState
        }

        componentDidMount() {
            this.currentState = update(this.state, {type: 'init', payload: {}})
            this.signal({type: 'init'})
        }

        componentWillReceiveProps(next) {
            const {init, children, ...exposeToState} = next

            this.currentState = update( this.currentState, {type: 'nextProps', payload: {props: exposeToState, next}})
            this.currentState = mergeDeepRight(this.currentState, exposeToState)
            // console.log('recieve props and set state to ', this.currentState)
            this.setState(this.currentState)
        }

        private currentState: State

        public signal = action => {
            this.currentState = update(this.currentState, action)

            this.setState(this.currentState as Partial<State>)
            // this.ioListeners.forEach(listener => listener(action))
            // console.log('set state to ', this.currentState)
            if (this.props[action.type])
                this.props[action.type](action.payload)

            resolvers
                // @ts-ignore
                .map(r => r(effects!, this.state, this.currentState))
                .filter(e => e !== undefined)
                .forEach(e => this.props[e.type] && this.props[e.type](e.payload))
        }

        private pureRefs: any = {}

        makeRef = name => element => {
            const domElement = ReactDOM.findDOMNode(element)
            if (this.pureRefs[name] !== domElement)
                this.pureRefs[name] = domElement
        }


        // @ts-ignore
        bindedActions = map(action => payload => this.signal(action(payload)), messages as any)
        setStateSignal = value => this.signal({type: 'setState', payload: value})
        render() {
            // @ts-ignore
            const {children, ...props} = this.props as any

            const outProps = Object.assign(
                {
                    // dispatch: getFrontendStore().dispatch,
                    makeRef: this.makeRef,
                    pureRefs: this.pureRefs,
                    setState: this.setStateSignal,
                },
                this.state,
                this.bindedActions,
            )
            let child = children

            child = components.reduceRight((
                p: ChildComp<P, M, E, S>,
                c: ChildComp<P, M, E, S> & {children: ChildComp<P, M, E, S>}) => {
                    // @ts-ignore
                    return withProps({children: p})(c)
                },
                child,
            )

            return child && child(outProps, this.context)
        }
    }
    if (hoc)
        // @ts-ignore
        Comp = hoc(Comp)

    if (stateMappers.length)
        Comp = connect((state, props) =>
            Object.assign({}, ...stateMappers.map(f => f(state, props))),
        )(Comp) as any as typeof Comp

    const value = {
        messages,
        effects,
        update,
        resolvers,
        ctx,
        components,
        hoc,
        stateMappers,
    }

    const Props: PureProps<P, M, E, S> = {} as any as PureProps<P, M, E, S>

    return Object.assign(
        Comp,
        value,
        {
            Props,
            of: <P1>(comp: React.ComponentType<P1 & ChildProps<P, M, E, S>>) =>
                Pure<P1 , {}, {}, {}>(
                    messages,
                    effects,
                    update,
                    resolvers,
                    ctx,
                    [comp],
                    hoc,
                    stateMappers,
                )
            ,

            ap: (component: React.ComponentType<ChildProps<P, M, E, S>  & {children?: any}>) =>
                Pure<P , M, E, S>(
                    messages,
                    effects,
                    update,
                    resolvers,
                    ctx,
                    components.concat([component]),
                    hoc,
                    stateMappers,
                )
            ,

            recieveProps: <P1 = Empty>(nextPropsReciever: any) =>
                Pure<P & P1, M, E, S>(
                    messages,
                    effects,
                    concatR(update, (state: S, action: any) => {
                        if (action.type === 'nextProps') {
                            return Object.assign(
                                {},
                                state,
                                nextPropsReciever(state, action.payload.props, action.payload.next),
                            ) as any as S
                        }
                        return state
                    }) as IConsumer<S, Action<any>, S>,
                    resolvers,
                    ctx,
                    components,
                    hoc,
                    stateMappers,
                ),

            contramap: <NewProps = Empty, OmitProps = Empty>
            (component: (props: ChildProps<P, M, E, S> & NewProps & {children?: any}, context?: any)
                     => React.ReactElement<ChildProps<P, M, E, S> & {children?: any}> ) =>
                Pure<P & NewProps, M, E, S>(
                    messages,
                    effects,
                    update,
                    resolvers,
                    ctx,
                    [component].concat(components),
                    hoc,
                    stateMappers,
                )
            ,

            valueOf: () => value,
            /**
             * Expose a messages for child component
             * @param {Msg}  the object with handlers to expose
             */
            addMsg: <Msg>(m: Msg) =>
                Pure<P, M & Msg, E & Msg, S>(
                    Object.assign({}, messages, m),
                    Object.assign({}, effects, m),
                    update,
                    resolvers,
                    ctx,
                    components,
                    hoc,
                    stateMappers,
                ),

            addReducer: <I, A = any, O = I>
            (reducer: IConsumer<I , A, O >) =>
                Pure<P, M, E, O & S & I>(
                    messages,
                    effects,
                    concatR(update, reducer) as IConsumer<O & S & I, Action<any>, O & S & I>,
                    resolvers,
                    ctx,
                    components,
                    hoc,
                    stateMappers,
                ),

            addEff: <Eff>(e: Eff) =>
                Pure<P, M & Eff, E & Eff, S>(
                    Object.assign({}, messages, e),
                    Object.assign({}, effects, e),
                    update,
                    resolvers,
                    ctx,
                    components,
                    hoc,
                    stateMappers,
                ),


            addResolver: (resolver: Resolver<S, E>) =>
                Pure<P, M, E, S>(
                    messages,
                    effects,
                    update,
                    resolvers.concat([resolver]),
                    ctx,
                    components,
                    hoc,
                    stateMappers,
                ),

            concat: <P1, M1, E1, S1>(nextPure: PureValue<P1, M1, E1, S1>) =>
                Pure<P & P1, M & M1, E & E1, S & S1>(
                    Object.assign({}, messages, nextPure.messages),
                    Object.assign({}, effects, nextPure.effects),
                    concatR(nextPure.update, update) as IConsumer<S1 & S, Action<any>, S1 & S>,
                    // @ts-ignore
                    [].concat(resolvers, nextPure.resolvers) as any as  Array<Resolver<S & S1, E & E1>>,
                    ctx,
                    components,
                    hoc,
                    stateMappers.concat(nextPure.stateMappers),
                ),

            connect: <I , O>(mapper: StateMapper<I, O>) =>
                Pure<I & P, M, E, S & O>(
                    messages,
                    effects,
                    update as any as IConsumer<S & O, Action<any>, S & O>,
                    resolvers,
                    ctx,
                    components,
                    hoc,
                    mapper ? stateMappers.concat([mapper]) : stateMappers,
                ),

            addProps: <InjectedProps>(props?: InjectedProps) =>
                Pure<P & Partial<InjectedProps>, M, E, S>(
                    messages,
                    effects,
                    update,
                    resolvers,
                    ctx,
                    components,
                    // @ts-ignore
                    defaultProps(props),
                    stateMappers,
                ),

            defaultProps: (props: Partial<P>) =>
                Pure<P, M, E, S>(
                    messages,
                    effects,
                    update,
                    resolvers,
                    ctx,
                    components,
                    // @ts-ignore
                    defaultProps(props),
                    stateMappers,
                ),

            addState: <S4>(defaultState?: S4) =>
                Pure<P, M, E, S>(
                    messages,
                    effects,
                    update,
                    resolvers,
                    ctx,
                    components,
                    hoc,
                    stateMappers,
                )
                    .addMsg(getStateActions<S4>())
                    .addReducer<S4>((state: S4, action) =>
                        action.type === 'setState'
                            ? Object.assign({}, state, action.payload)
                            : state,
                    ),


        },
    )
}

export type StateMapper<I, O, S = any> = (state: S, props?: I) => O

