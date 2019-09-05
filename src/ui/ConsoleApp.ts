import WorklogService, {Worklog} from "../core/WorklogService";
import jiraFormat from "../core/jiraFormat";


export default class ConsoleApp {
    private static worklog = new WorklogService();

    static run() {
        this.worklog.getSummedWorklogsByUser()
            .then(worklogs => worklogs.forEach(this.logToConsole));
    }

    private static logToConsole(worklog: Worklog) {
        console.log(worklog.author.displayName + ": " + jiraFormat(worklog.timeSpentInMinutes));
    }
}