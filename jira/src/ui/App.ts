import WorklogService from "./core/WorklogService";
import jiraFormat from "./core/jiraFormat";


export default class App {
    private static worklog = new WorklogService();

    static run() {
        this.worklog.getSummedWorklogsByUser()
            .forEach(worklog => console.log(worklog.author.displayName + ": " + jiraFormat(worklog.timeSpendInMinutes)))
    }
}