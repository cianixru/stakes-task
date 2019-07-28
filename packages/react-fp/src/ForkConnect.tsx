import * as React from 'react'

import { connect } from 'react-redux'

type Action<P> = {
  type: string
  payload: P
}

type Dispatcher = (action: any) => any

type HocProps<P, S> = P & {
  onCommit?: (localHistory: Array<Action<any>>) => any
  onReset?: () => void
  onFork?: () => any
  onChange?: (action: Action<any>, forked: boolean) => any
  localHistory?: Array<Action<any>>
  forked?: boolean
  frontState?: S
  dispatch?: (action: Action<any>) => any
  forkDisabled?: boolean
}

type ForkedChildProps<P, M> = {
  dispatch: Dispatcher
  forked?: boolean
  fork: () => void
  commit: () => void
  reset: () => void
  localHistory: string[]
} & P &
  M

export default function<P, M, FrontState, Reducer extends Function>(
  mapper: { (state: FrontState, props?: P): M },
  frontReducer: Reducer,
) {
  return (Component: React.ComponentType<ForkedChildProps<P, M>>) =>
    (connect(
      (state: FrontState) => ({ frontState: state }),
      dispatch => ({ dispatch }),
    )(
      class extends React.Component<
        HocProps<P, FrontState>,
        {
          frontState?: FrontState
          localHistory?: Array<Action<any>>
          forked?: boolean
        }
      > {
        constructor(props: HocProps<P, FrontState>) {
          super(props)
          this.state = {
            frontState: props.frontState,
            forked: !!props.forked,
            localHistory: props.localHistory || [],
          }

          this.saveForkedState()
        }

        saveForkedState = () => {
          this.nextFrontState = this.state.frontState!
          this.localHistory = this.state.localHistory!
        }

        private nextFrontState: FrontState

        private localHistory: Array<Action<any>> = []

        localDispatch = action => {
          this.nextFrontState = frontReducer(this.nextFrontState, action)
          this.localHistory = (this.localHistory || []).concat([action])
          this.setState(
            {
              frontState: this.nextFrontState,
              localHistory: this.localHistory,
            },
            this.saveForkedState,
          )

          if (this.props.onChange) this.props.onChange(action, true)
        }

        forwardDispatch = action => {
          // @ts-ignore
          this.props.dispatch(action)
          if (this.props.onChange) this.props.onChange(action, false)
        }

        commit = () => {
          if (!this.props.forkDisabled)
            // @ts-ignore
            this.state.localHistory!.forEach(this.props.dispatch!)
          this.setState({
            forked: false,
            localHistory: [],
          })
          if (this.props.onCommit)
            // @ts-ignore
            this.props.onCommit(this.state.localHistory)
          this.saveForkedState()
        }

        fork = () => {
          this.setState({
            frontState: this.props.frontState,
            forked: true,
            localHistory: [],
          })
          if (this.props.onFork) this.props.onFork()
          this.saveForkedState()
        }

        reset = () => {
          this.setState({
            frontState: this.props.frontState,
            forked: false,
            localHistory: [],
          })
          if (this.props.onReset) this.props.onReset()
          this.saveForkedState()
        }

        componentWillReceiveProps(nextProps) {
          if (
            nextProps.forked !== undefined &&
            nextProps.forked !== this.state.forked
          ) {
            this.setState(
              { frontState: nextProps.frontState },
              this.saveForkedState,
            )
          }
          if (nextProps.localHistory !== this.props.localHistory) {
            this.setState(
              { localHistory: this.localHistory as any },
              this.saveForkedState,
            )
          }
        }

        render() {
          const a: HocProps<P, FrontState> = this.props
          const { forked, dispatch, frontState, ...props } = a
          const connectedProps = mapper(this.state.frontState!, props || {})
          return this.state.forked && !this.props.forkDisabled ? (
            <Component
              {...props}
              fork={this.fork}
              commit={this.commit}
              forked={this.state.forked}
              reset={this.reset}
              dispatch={this.localDispatch}
              localHistory={this.state.localHistory}
              frontState={this.state.frontState}
              {...connectedProps}
            />
          ) : (
            <Component
              {...props}
              fork={this.fork}
              commit={this.commit}
              forked={this.state.forked}
              reset={this.reset}
              frontState={this.props.frontState}
              dispatch={this.forwardDispatch}
              localHistory={this.state.localHistory}
              {...mapper(this.props.frontState, props)}
            />
          )
        }
      },
    ) as any) as React.ComponentClass<HocProps<P, FrontState>>
}
