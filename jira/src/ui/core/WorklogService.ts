import groupBy from "./groupBy";

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

        const worklogsUrl = window.location.origin + "/rest/api/2/issue/" + window.location.pathname.replace("/browse/", "") + "/worklog";

        return fetch(worklogsUrl, {"method": "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Bad status")
                }
                return response.json();
            })
            .then(responseJson => responseJson.worklogs.map(WorklogService.toWorklog))
            .then(this.sumUp)
            .then(WorklogService.groupedByDisplayName)

    }

    private sumUp(worklog: Worklog[]): Worklog[] {
        return groupBy(worklog, w => w.author.displayName)
            .map(tupel => tupel.values.reduce((previousValue, currentValue) => {
            const newValue = {...previousValue};
            newValue.timeSpentInMinutes += currentValue.timeSpentInMinutes;
            return newValue;
            })).sort((a, b,) => a.author.displayName < b.author.displayName ? -1 : 1);
    }
}