import groupBy from "./groupBy";
import IssueSiteInfos from "./IssueSiteInfos";

export interface WorklogSumByUser {
    author: {
        displayName: string,
    };
    timeSpentInMinutes: number;
}

export interface Worklog {
    author: {
        displayName: string,
        name: string;
    };
    timeSpentInMinutes: number;
    started: string;
    id: string;
    comment: string;
}

export default class WorklogService {
    public static async getSummedWorklogsByUser(): Promise<WorklogSumByUser[]> {
        const issueKey = IssueSiteInfos.getCurrentIssueKey();
        return this.getWorklogsPerUser(issueKey).then(this.sumUp);

    }

    private static getWorklogsPerUser(issueKey: string) {
        return fetch(IssueSiteInfos.getWorklogUrlForIssueKey(issueKey), {method: "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Unexpected request status: " + response.status);
                }
                return response.json();
            })
            .then((responseJson) => responseJson.worklogs.map(WorklogService.toWorklog));
    }

    private static toWorklog(responseWorklog: any): Worklog {
        const timeSpentInMinutes = Math.floor(responseWorklog.timeSpentSeconds / 60);
        const author = responseWorklog.author;

        return {
            author: {
                displayName: responseWorklog.author.displayName,
                name: "MISSING CONVERSION",
            },
            timeSpentInMinutes,
            comment: "MISSING CONVERSION",
            id: "MISSING CONVERSION",
            started: "MISSING CONVERSION",
        };
    }

    private static sumUp(worklog: Worklog[]): WorklogSumByUser[] {
        const worklogSums: WorklogSumByUser[] = worklog.map(wl => ({
            author: {
                displayName: wl.author.displayName,
            },
            timeSpentInMinutes: wl.timeSpentInMinutes,
        }));

        return groupBy(worklogSums, (w) => w.author.displayName)
            .map((tupel) => tupel.values.reduce((previousValue, currentValue) => {
                const newValue = {...previousValue};
                newValue.timeSpentInMinutes += currentValue.timeSpentInMinutes;
                return newValue;
            }))
            .sort((a, b) => a.author.displayName < b.author.displayName ? -1 : 1);
    }
}
