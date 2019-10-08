import JiraTimeService from "./JiraTimeService";
import {Worklog} from "./WorklogService";

export default class WorklogShiftService {
    public static async shiftWorklog(worklog: Worklog, timeToShiftJiraString: string, targetIssueKey: string): Promise<void> {
        const timeToShiftInMinutes = JiraTimeService.jiraFormatToMinutes(timeToShiftJiraString);

        if (timeToShiftInMinutes > worklog.timeSpentInMinutes) {
            throw new Error("It's not possible to shift more time than exist on a worklog");
        }

        throw new Error("Not implemented yet");
    }
}
