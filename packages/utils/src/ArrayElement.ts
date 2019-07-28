export type ArrayElement<ArrayType> =
  ArrayType extends (infer ElementType)[]
    ? ElementType
    : never
