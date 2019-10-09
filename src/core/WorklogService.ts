import groupBy from "./groupBy";
import IssueSiteInfos from "./IssueSiteInfos";
import JiraTimeService from "./JiraTimeService";
import UserService from "./UserService";

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
    issueId: string;
}

export default class WorklogService {
    public static async createWorklog(worklog: {
        timeSpentInMinutes: number;
        started: string;
        comment: string;
        issueKey: string;
    }): Promise<void> {
        const {comment, issueKey, started, timeSpentInMinutes} = worklog;
        const timeSpent = JiraTimeService.minutesToJiraFormat(timeSpentInMinutes);

        const response = await fetch(IssueSiteInfos.getWorklogUrlForIssueKey(issueKey), {
            method: "POST",
            body: JSON.stringify({
                comment,
                timeSpent,
                started,
            }),
        }).catch(() => {
            throw new Error("Communication error: Worklog creation failed");
        });

        if (response.status !== 201) {
            throw new Error("Unexpected status code. Creation of worklog probably not sucecssful");
        }
    }

    public static async deleteWorklog(worklog: Worklog): Promise<void> {
        const response = await fetch(IssueSiteInfos.getWorklogModifyUrlByWorklog(worklog), {method: "DELETE"})
            .catch(() => {
                throw new Error("Communication error: Worklog creation failed");
            });

        if (response.status !== 204) {
            throw new Error("Unexpected status code. Deletion of worklog probably not sucecssful");
        }
    }

    public static async updateWorklog(worklog: Worklog): Promise<void> {
        // TODO: marmer 08.10.2019 implement
        throw new Error("Not implemented yet");
    }
    public static async getSummedWorklogsByUser(): Promise<WorklogSumByUser[]> {
        const issueKey = IssueSiteInfos.getCurrentIssueKey();
        return this.getWorklogByIssueKey(issueKey).then(this.sumUp);
    }

    public static async getWorklogsForCurrentIssueAndUser(): Promise<Worklog[]> {
        const worklogByIssueKey = await WorklogService.getWorklogByIssueKey(IssueSiteInfos.getCurrentIssueKey());
        const currentUserName = await UserService.getCurrentUserName();
        return worklogByIssueKey.filter(worklog => worklog.author.name === currentUserName);
    }

    private static async getWorklogByIssueKey(issueKey: string): Promise<Worklog[]> {
        return fetch(IssueSiteInfos.getWorklogUrlForIssueKey(issueKey), {method: "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Unexpected response status: " + response.status);
                }
                return response.json();
            })
            .then((responseJson) => responseJson.worklogs.map(WorklogService.toWorklog));
    }

    private static toWorklog(responseWorklog: any): Worklog {
        const {timeSpentSeconds, comment, author, id, started, issueId} = responseWorklog;
        const timeSpentInMinutes = Math.floor(timeSpentSeconds / 60);
        const {displayName, name} = author;

        return {
            author: {
                displayName,
                name,
            },
            timeSpentInMinutes,
            comment,
            id,
            started,
            issueId,
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
