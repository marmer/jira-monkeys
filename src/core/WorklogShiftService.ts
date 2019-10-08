import JiraTimeService from "./JiraTimeService";
import {Worklog} from "./WorklogService";

export default class WorklogShiftService {
    public static async shiftWorklog(worklog: Worklog, timeToShiftJiraString: string, targetIssueKey: string): Promise<void> {
        JiraTimeService.jiraFormatToMinutes(timeToShiftJiraString);

        return Promise.reject(new Error("Not implemented yet"));
    }
}
