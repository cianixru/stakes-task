import {makeRoute, push} from '@sha/router'

export {push}

export const nav = {
  home: makeRoute('/'),
  events: makeRoute<{ eventId: string }>('/tapes/:eventId'),
  tapes: makeRoute<{ tape_no: string }>('/tapes/:tape_no'),
  searchEvents: makeRoute('/searchEvents/'),
  searchLogs: makeRoute('/searchLogs/'),
  searchTapes: makeRoute('/searchTapes/'),
}
