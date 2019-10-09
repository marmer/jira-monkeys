import JiraTimeService from "./JiraTimeService";
import WorklogService, {Worklog} from "./WorklogService";

export default class WorklogShiftService {
    public static async shiftWorklog(worklog: Worklog, timeToShiftJiraString: string, targetIssueKey: string): Promise<void> {
        const timeToShiftInMinutes = JiraTimeService.jiraFormatToMinutes(timeToShiftJiraString);
        if (timeToShiftInMinutes === 0) {
            return;
        }
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
        }).catch(() => {
            throw new Error("Error while creating the new worklog. At least the source worklog has not been changed yet.");
        });

        try {
            if (timeSpentInMinutes === timeToShiftInMinutes) {
                await WorklogService.deleteWorklog(worklog);
            } else {
                await WorklogService.updateWorklog({
                    ...worklog,
                    timeSpentInMinutes: timeSpentInMinutes - timeToShiftInMinutes,
                });
            }
        } catch (reason) {
            throw new Error("Error while updating the worklog to change (source).");
        }
    }
}
