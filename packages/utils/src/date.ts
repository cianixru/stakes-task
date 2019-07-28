export const MINUTE_MILIS = 60 * 1000

export const HOUR_MILIS = 60 * MINUTE_MILIS

export const DAY_MILIS = 24 * HOUR_MILIS

export const WEEK_MILIS = DAY_MILIS * 7

export const now = (offser: number = 0): number => new Date().getTime() + offser

export const cloneDate = (date: Date): Date => new Date(date.getTime())

export const formatYYYYMMDD = (date: Date, delimiter: string = '-'): string =>
  date.getFullYear() + delimiter + formatMM(date) + delimiter + formatDD(date)

export const formatMM = (date: Date): string =>
  formatTwoSignFromInt(date.getMonth() + 1)

export const formatDD = (date: Date): string =>
  formatTwoSignFromInt(date.getDate())

export const formatTwoSignFromInt = (value: number): string =>
  value >= 10 ? String(value) : '0' + value

export const shortTimeZone = (
  offset: number = new Date().getTimezoneOffset(),
) =>
  (offset > 0 ? '-' : '+') +
  formatTwoSignFromInt(Math.floor(-offset / 60)) +
  ':' +
  formatTwoSignFromInt(-offset % 60)
