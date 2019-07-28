import React from 'react'
import { ExtractProps } from './extractProps'

export const makeComponent = <K extends keyof JSX.IntrinsicElements>(tag: K) =>
  (React.memo(
    React.forwardRef((props: JSX.IntrinsicElements[K], ref) =>
      React.createElement(tag, { ...props, ref }),
    ),
  ) as any) as React.ComponentClass<JSX.IntrinsicElements[K]>

export const Div = makeComponent('div')
export type DivProps = ExtractProps<typeof Div>

export const Label = makeComponent('label')
export type LabelProps = ExtractProps<typeof Label>

export const H1 = makeComponent('h1')
export type H1Props = ExtractProps<typeof H1>

export const H2 = makeComponent('h2')
export type H2Props = ExtractProps<typeof H2>

export const Span = makeComponent('span')
export type SpanProps = ExtractProps<typeof Span>

export const Section = makeComponent('section')
export type SectionProps = ExtractProps<typeof Section>

export const Button = makeComponent('button')
export type ButtonProps = ExtractProps<typeof Button>

export const HTMLInput = makeComponent('input')
export type HTMLInputProps = ExtractProps<typeof HTMLInput>

export const HTMLSelect = makeComponent('select')
export type HTMLSelectProps = ExtractProps<typeof HTMLSelect>

export const SVG = makeComponent('svg')
export type SVGProps = ExtractProps<typeof SVG>

export const TextArea = makeComponent('textarea')
export type TextAreaProps = ExtractProps<typeof TextArea>

export const Ul = makeComponent('ul')
export type UlProps = ExtractProps<typeof Ul>

export const Li = makeComponent('li')
export type LiProps = ExtractProps<typeof Li>

export const Img = makeComponent('img')
export type ImgProps = ExtractProps<typeof Img>

export const A = makeComponent('a')
export type AProps = ExtractProps<typeof A>
