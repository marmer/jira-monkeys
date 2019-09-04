export interface Worklog {
    author: {
        displayName: string
    }
    timeSpentInMinutes: number
}

export default class WorklogService {
    private static groupedByDisplayName(worklogs: Worklog[]): Worklog[] {

        return worklogs;
    }

    private static toWorklog(responseWorklog: any): Worklog {
        const timeSpentInMinutes = Math.floor(responseWorklog.timeSpentSeconds / 60);
        const author = responseWorklog.author;

        return {
            author,
            timeSpentInMinutes
        }
    }

    getSummedWorklogsByUser(): Promise<Worklog[]> {
        // FIXME: marmer load All worklogs instead of just a page of 20 to sum up

        return fetch(window.location.origin + "/rest/api/2/issue/" + window.location.pathname.replace("/browse/", "") + "/worklog", {
            "method": "GET"
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Bad status")
                }
                return response.json();
            })
            .then(responseJson => responseJson.worklogs.map(WorklogService.toWorklog))
            .then(WorklogService.groupedByDisplayName)

    }
}