/*
 * Get all of the indexes for a substring in another string
 */
export const getStringIndexes = (sub: string, str: string): number[]  => {
  const subLen = sub.length

  if (subLen < 1) {
    return []
  }

  let i = 0
  let is = []

  while ((i = str.indexOf(sub, i)) > -1) {
    is.push(i)
    i = i + subLen
  }

  return is
}
