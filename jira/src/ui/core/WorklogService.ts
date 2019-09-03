export interface Worklog {
    author: {
        displayName: string
    }
    timeSpendInMinutes: number
}

export default class WorklogService {
    getSummedWorklogsByUser(): Worklog[] {
        return [{author: {displayName: "me"}, timeSpendInMinutes: 42},
            {author: {displayName: "myself"}, timeSpendInMinutes: 546},
            {author: {displayName: "and I"}, timeSpendInMinutes: 1337}]
    }
}