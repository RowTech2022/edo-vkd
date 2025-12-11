export const SESSIONS = 'EDO/SESSIONS'
export const SESSION_ID = 'session-id'
interface IGetSessions {
  sessions: string[]
  signOutUser: boolean
}

export const getSessions = (): IGetSessions => {
  let data = localStorage.getItem(SESSIONS)

  let sessions = data ? JSON.parse(data) : []

  if (!sessions) sessions = []

  return {
    sessions,
    signOutUser: data ? sessions.length === 0 : false,
  }
}

export const getSession = (): IGetSessions => {
  let data = localStorage.getItem(SESSIONS)

  let sessions = data ? JSON.parse(data) : []

  if (!sessions) sessions = []

  return {
    sessions,
    signOutUser: data ? sessions.length === 0 : false,
  }
}
