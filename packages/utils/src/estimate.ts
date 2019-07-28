export const estimate = <T>(
  test: () => T,
  label: string = 'someFunction',
): T => {
  console.time('estimate ' + label)

  const result = test()

  console.timeEnd('estimate ' + label)
  return result
}
