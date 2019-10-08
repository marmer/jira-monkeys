import {Worklog} from "./WorklogService";

export default class WorklogShiftService {
    public static async shiftFromWorklog(worklog: Worklog, timeToShiftAsJiraString: string, targetIssueKey: string): Promise<void> {
        return Promise.reject(new Error("Not implemented yet"));
    }
}
