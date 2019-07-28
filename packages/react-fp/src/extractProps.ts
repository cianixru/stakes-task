import React from 'react'

type Fn1<T> = (props: T, ...a: any[]) => any


/**
 * Infer Props type by type of the component
 *
 * @example
 * type Props = ExtractProps<typeof Component>
 */
export type ExtractProps<TComponent> =
    TComponent extends React.ComponentType<infer TProps>
        ? TProps
        : TComponent extends Fn1<infer T>
            ? T
            : TComponent
