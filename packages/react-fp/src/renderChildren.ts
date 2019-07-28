import * as React from 'react'
import {omit} from 'ramda'

/**
 * Interface for renderChildren function,
 * could be any react node ar component.
 * For both: components and render props
 */
export type Renderable<P = {}> =
    React.ComponentType<P> | React.ReactNode

/**
 * Could forfard props for "Renderable"
 * Use case:
 * <Component value='1'>
 * {
 *     props =>
 *          props.value  // props forwarded and inferred by TypeScript here
 * }
 * </Component>
 * Accepts Renderable as parameter
 */
export default <P = {}>(
    children: Renderable<P>,
    props?: (P & {children?: Renderable<P> }),
) => {
    const omittedProps = props
        ? (children === props.children ? omit(['children'], props) : props)
        : {}
    return typeof children === 'function'
        ? React.createElement(children as any as React.ComponentType<P>, omittedProps as any)
        : children
}
