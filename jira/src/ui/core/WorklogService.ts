export interface Worklog {
    author: {
        displayName: string
    }
    timeSpentInMinutes: number
}

export default class WorklogService {
    getSummedWorklogsByUser(): Promise<Worklog[]> {
        // FIXME: marmer load All worklogs instead of just a page of 20 to sum up

        return fetch(window.location.origin + "/rest/api/2/issue/" + window.location.pathname.replace("/browse/", ""), {
            "method": "GET"
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Bad status")
                }
                return response.json();
            })
            .then(ticket => {
                return ticket.fields.worklog.worklogs.map(this.toWorklog);
            })
            .then(this.groupedByDisplayName)

    }

    private groupedByDisplayName(worklogs: Worklog[]): Worklog[] {
        // TODO: marmer 04.09.2019 implement me
        return worklogs;
    }

    private toWorklog(responseWorklog: any): Worklog {
        const timeSpentInMinutes = Math.floor(responseWorklog.timeSpentSeconds / 60);
        const author = responseWorklog.author;

        return {
            author,
            timeSpentInMinutes
        }
    }
}