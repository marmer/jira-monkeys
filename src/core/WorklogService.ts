import groupBy from "./groupBy";
import IssueSiteInfos from "./IssueSiteInfos";

export interface Worklog {
    author: {
        displayName: string
    }
    timeSpentInMinutes: number
}

export default class WorklogService {
    public static getSummedWorklogsByUser(): Promise<Worklog[]> {
        const issueKey = IssueSiteInfos.getCurrentIssueKey();
        return this.getWorklogsPerUser(issueKey).then(this.sumUp)

    }

    private static getWorklogsPerUser(issueKey: string) {
        const worklogsUrl = window.location.origin + "/rest/api/2/issue/" + issueKey + "/worklog";

        return fetch(worklogsUrl, {"method": "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Bad status")
                }
                return response.json();
            })
            .then(responseJson => responseJson.worklogs.map(WorklogService.toWorklog));
    }

    private static toWorklog(responseWorklog: any): Worklog {
        const timeSpentInMinutes = Math.floor(responseWorklog.timeSpentSeconds / 60);
        const author = responseWorklog.author;

        return {
            author,
            timeSpentInMinutes
        }
    }

    private static sumUp(worklog: Worklog[]): Worklog[] {
        return groupBy(worklog, w => w.author.displayName)
            .map(tupel => tupel.values.reduce((previousValue, currentValue) => {
            const newValue = {...previousValue};
            newValue.timeSpentInMinutes += currentValue.timeSpentInMinutes;
            return newValue;
            })).sort((a, b,) => a.author.displayName < b.author.displayName ? -1 : 1);
    }
}