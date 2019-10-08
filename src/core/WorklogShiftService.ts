import {Worklog} from "./WorklogService";

export default class WorklogShiftService {
    public static async shiftWorklog(worklog: Worklog, timeToShiftAsJiraString: string, targetIssueKey: string): Promise<void> {
        return Promise.reject(new Error("Not implemented yet"));
    }
}
