import WorklogService, {Worklog} from "../core/WorklogService";
import jiraFormat from "../core/jiraFormat";


export default class ConsoleApp {

    static run() {
        WorklogService.getSummedWorklogsByUser()
            .then(worklogs => worklogs.forEach(this.logToConsole));
    }

    private static logToConsole(worklog: Worklog) {
        console.log(worklog.author.displayName + ": " + jiraFormat(worklog.timeSpentInMinutes));
    }
}