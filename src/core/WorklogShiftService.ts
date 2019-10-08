import JiraTimeService from "./JiraTimeService";
import WorklogService, {Worklog} from "./WorklogService";

export default class WorklogShiftService {
    public static async shiftWorklog(worklog: Worklog, timeToShiftJiraString: string, targetIssueKey: string): Promise<void> {
        const timeToShiftInMinutes = JiraTimeService.jiraFormatToMinutes(timeToShiftJiraString);

        if (timeToShiftInMinutes > worklog.timeSpentInMinutes) {
            throw new Error("It's not possible to shift more time than exist on a worklog");
        }

        const {
            comment,
            started,
            timeSpentInMinutes,
        } = worklog;

        await WorklogService.createWorklog({
            comment,
            issueKey: targetIssueKey,
            started,
            timeSpentInMinutes,
        });

        if (timeSpentInMinutes === timeToShiftInMinutes) {
            await WorklogService.deleteWorklog(worklog);
        } else {
            await WorklogService.updateWorklog({
                ...worklog,
                timeSpentInMinutes: timeSpentInMinutes - timeToShiftInMinutes,
            });
        }
    }
}
